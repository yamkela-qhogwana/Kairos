using Kairos.Application.Products;

namespace Kairos.Application.Search;

public class SearchResultDto
{
    public string? Interpretation { get; set; }
    public IReadOnlyList<ProductDto> Products { get; set; } = Array.Empty<ProductDto>();
}
