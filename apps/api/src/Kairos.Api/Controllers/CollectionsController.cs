using Kairos.Application.Products;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionsController(ICollectionQueryService collectionQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CollectionDto>>> GetCollections(CancellationToken cancellationToken)
    {
        var collections = await collectionQueryService.GetCollectionsAsync(cancellationToken);
        return Ok(collections);
    }
}
