namespace Kairos.Application.Products;

public class CategoryDto
{
    public byte CategoryId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
