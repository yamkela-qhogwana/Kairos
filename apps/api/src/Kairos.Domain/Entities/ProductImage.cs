namespace Kairos.Domain.Entities;

public class ProductImage
{
    public long ProductImageId { get; set; }

    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
