namespace Kairos.Application.Products;

public class ProductDto
{
    public long ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public byte CategoryId { get; set; }
    public string CategorySlug { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string? SubcategorySlug { get; set; }
    public string? SubcategoryName { get; set; }
    public IReadOnlyList<ProductSizeDto> Sizes { get; set; } = Array.Empty<ProductSizeDto>();
    public decimal OriginalPrice { get; set; }
    public decimal? SalePrice { get; set; }
    public int? DiscountPercentage { get; set; }
    public bool IsOnSale { get; set; }
    public DateTime? SaleEndsAt { get; set; }
    public double Rating { get; set; }
    public bool IsRentable { get; set; }
    public bool IsLuxe { get; set; }
    public IReadOnlyList<string> Images { get; set; } = Array.Empty<string>();
    public long StoreId { get; set; }
    public string StoreName { get; set; } = string.Empty;
}
