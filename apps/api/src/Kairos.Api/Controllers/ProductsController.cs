using Kairos.Application.Products;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IProductQueryService productQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var products = await productQueryService.GetProductsAsync(category, cancellationToken);
        return Ok(products);
    }
}
