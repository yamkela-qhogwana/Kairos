using Kairos.Application.Products;
using Kairos.Domain.Entities;
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
            .Include(p => p.Subcategory)
            .Include(p => p.Images)
            .Include(p => p.Sale)
            .Include(p => p.Sizes)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category.Slug == category);
        }

        var products = await query
            .OrderByDescending(p => p.Rating)
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

        return products.Select(MapToDto).ToList();
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        ProductId = p.ProductId,
        Title = p.Title,
        Description = p.Description,
        CategoryId = p.CategoryId,
        CategorySlug = p.Category.Slug,
        CategoryName = p.Category.Name,
        SubcategorySlug = p.Subcategory?.Slug,
        SubcategoryName = p.Subcategory?.Name,
        Sizes = p.Sizes.Select(s => new ProductSizeDto { Size = s.Size, Quantity = s.Quantity, UnitsSold = s.UnitsSold }).ToList(),
        OriginalPrice = p.OriginalPrice,
        SalePrice = p.SalePrice,
        DiscountPercentage = p.DiscountPercentage,
        IsOnSale = p.SalePrice != null && p.SalePrice < p.OriginalPrice,
        SaleEndsAt = p.Sale != null ? p.Sale.EndDate : null,
        Rating = p.Rating,
        IsRentable = p.IsRentable,
        IsLuxe = p.IsLuxe,
        Images = p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
        StoreId = p.StoreId,
        StoreName = p.Store.Name,
    };
}
