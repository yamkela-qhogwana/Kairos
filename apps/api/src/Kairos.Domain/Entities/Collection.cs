namespace Kairos.Domain.Entities;

public class Collection
{
    public byte CollectionId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public byte SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
