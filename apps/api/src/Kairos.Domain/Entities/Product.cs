namespace Kairos.Domain.Entities;

public class Product
{
    public long ProductId { get; set; }

    public long StoreId { get; set; }
    public Store Store { get; set; } = null!;

    // Optional link to a named promo campaign (e.g. "Summer Clearance").
    public long? SaleId { get; set; }
    public Sale? Sale { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public byte CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public byte? SubcategoryId { get; set; }
    public Subcategory? Subcategory { get; set; }

    public ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();

    public decimal OriginalPrice { get; set; }

    // Vendor-set discounted price. Null = not on sale.
    public decimal? SalePrice { get; set; }

    // Always derived from OriginalPrice/SalePrice server-side — never set
    // independently, so it can't drift out of sync with the actual prices.
    public int? DiscountPercentage { get; set; }

    public double Rating { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

    // Drives the "Rent" collection — a simple flag, not a full rental
    // system (no duration/rate/booking logic yet).
    public bool IsRentable { get; set; }

    // Drives the "Luxe" collection. Unlike IsRentable, this isn't something
    // a seller sets on their own listing — it's a platform-verified badge
    // meaning the item has been checked as authentic and high quality, not
    // derived from price and not self-declared.
    public bool IsLuxe { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
