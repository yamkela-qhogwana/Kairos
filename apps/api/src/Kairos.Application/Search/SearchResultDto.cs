using Kairos.Application.Products;

namespace Kairos.Application.Search;

public class SearchResultDto
{
    public string? Interpretation { get; set; }

    // The spell-corrected query text, e.g. "dress" for a "drss" search — null
    // if nothing needed correcting. Recent-search history should store this
    // instead of the raw typed query.
    public string? CorrectedQuery { get; set; }

    public IReadOnlyList<ProductDto> Products { get; set; } = Array.Empty<ProductDto>();
}
