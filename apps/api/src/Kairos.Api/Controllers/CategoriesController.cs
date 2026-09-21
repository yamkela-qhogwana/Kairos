using Kairos.Application.Products;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(ICategoryQueryService categoryQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(CancellationToken cancellationToken)
    {
        var categories = await categoryQueryService.GetCategoriesAsync(cancellationToken);
        return Ok(categories);
    }
}
