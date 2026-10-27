namespace Kairos.Domain.Entities;

public class Subcategory
{
    public byte SubcategoryId { get; set; }

    public byte CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public byte SortOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
