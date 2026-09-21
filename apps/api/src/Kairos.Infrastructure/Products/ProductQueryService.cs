using Kairos.Application.Products;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Products;

public class ProductQueryService(KairosDbContext dbContext) : IProductQueryService
{
    public async Task<IReadOnlyList<ProductDto>> GetProductsAsync(
        string? category = null,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category.Slug == category);
        }

        return await query
            .OrderByDescending(p => p.Rating)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Title = p.Title,
                Description = p.Description,
                CategoryId = p.CategoryId,
                CategorySlug = p.Category.Slug,
                CategoryName = p.Category.Name,
                OriginalPrice = p.OriginalPrice,
                SalePrice = p.SalePrice,
                DiscountPercentage = p.DiscountPercentage,
                IsOnSale = p.SalePrice != null && p.SalePrice < p.OriginalPrice,
                Rating = p.Rating,
                Images = p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
                StoreId = p.StoreId,
                StoreName = p.Store.Name,
            })
            .ToListAsync(cancellationToken);
    }
}
