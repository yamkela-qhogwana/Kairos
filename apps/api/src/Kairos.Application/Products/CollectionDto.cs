namespace Kairos.Application.Products;

public class CollectionDto
{
    public byte CollectionId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}
