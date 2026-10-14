using Kairos.Application.Products;

namespace Kairos.Application.Search;

public interface ISearchService
{
    Task<SearchResultDto> SearchAsync(string query, CancellationToken cancellationToken = default);

    // Fast, AI-free typeahead — used for live suggestions while the user is
    // still typing. Must not call the LLM (too slow for a keystroke).
    Task<IReadOnlyList<SearchSuggestionDto>> SuggestAsync(string query, CancellationToken cancellationToken = default);
}
