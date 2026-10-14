using System.Text;
using Kairos.Api.Auth;
using Kairos.Application.Auth;
using Kairos.Application.Products;
using Kairos.Application.Search;
using Kairos.Infrastructure.Auth;
using Kairos.Infrastructure.Persistence;
using Kairos.Infrastructure.Products;
using Kairos.Infrastructure.Search;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<KairosDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.UseNetTopologySuite()));

builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IUserRegistrationService, UserRegistrationService>();
builder.Services.AddScoped<IUserLoginService, UserLoginService>();
builder.Services.AddScoped<IPasswordResetService, PasswordResetService>();
builder.Services.AddScoped<IUserLookupService, UserLookupService>();
builder.Services.AddScoped<IProductQueryService, ProductQueryService>();
builder.Services.AddScoped<ICategoryQueryService, CategoryQueryService>();
builder.Services.AddHttpClient<OllamaQueryInterpreter>();
builder.Services.AddHttpClient<TypesenseClient>();
builder.Services.AddScoped<ISearchService, SearchService>();

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is not configured.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Sync the catalog into Typesense on boot so search has something to query.
// If Typesense isn't reachable, SearchService falls back to keyword search,
// so a failure here must not block startup.
using (var scope = app.Services.CreateScope())
{
    try
    {
        var typesenseClient = scope.ServiceProvider.GetRequiredService<TypesenseClient>();
        var dbContext = scope.ServiceProvider.GetRequiredService<KairosDbContext>();

        await typesenseClient.EnsureCollectionAsync(CancellationToken.None);

        var docs = await dbContext.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .Select(p => new TypesenseProductDoc
            {
                Id = p.ProductId.ToString(),
                Title = p.Title,
                CategorySlug = p.Category.Slug,
                Price = (double)(p.SalePrice ?? p.OriginalPrice),
                IsOnSale = p.SalePrice != null && p.SalePrice < p.OriginalPrice,
                Rating = p.Rating,
            })
            .ToListAsync();

        await typesenseClient.UpsertProductsAsync(docs, CancellationToken.None);
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Could not sync products into Typesense at startup; search will fall back to keyword matching.");
    }
}

app.Run();
