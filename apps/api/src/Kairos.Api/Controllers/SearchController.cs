using Kairos.Application.Search;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController(ISearchService searchService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SearchResultDto>> Search([FromQuery] string q, CancellationToken cancellationToken)
    {
        var result = await searchService.SearchAsync(q ?? string.Empty, cancellationToken);
        return Ok(result);
    }

    [HttpGet("suggest")]
    public async Task<ActionResult<IReadOnlyList<SearchSuggestionDto>>> Suggest(
        [FromQuery] string q,
        CancellationToken cancellationToken)
    {
        var result = await searchService.SuggestAsync(q ?? string.Empty, cancellationToken);
        return Ok(result);
    }
}
