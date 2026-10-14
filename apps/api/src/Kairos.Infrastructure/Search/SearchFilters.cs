namespace Kairos.Infrastructure.Search;

public class SearchFilters
{
    public string? CategorySlug { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool OnSaleOnly { get; set; }
    public List<string> Keywords { get; set; } = new();
    public string? Interpretation { get; set; }
}
