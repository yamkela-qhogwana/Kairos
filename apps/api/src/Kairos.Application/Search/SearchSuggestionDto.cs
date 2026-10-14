namespace Kairos.Application.Search;

public class SearchSuggestionDto
{
    public string Text { get; set; } = string.Empty;

    // "category" or "product" — both are grounded in real catalog data,
    // never invented by the AI.
    public string Type { get; set; } = "product";
}
