using Kairos.Application.Products;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(
    IProductQueryService productQueryService,
    IProductStockService productStockService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var products = await productQueryService.GetProductsAsync(category, cancellationToken);
        return Ok(products);
    }

    // Called when a purchase goes through for one size — decrements stock
    // and returns what's left. No order/checkout system exists yet, so this
    // is the primitive that flow will call once it's built.
    [HttpPost("{productId}/sizes/{size}/purchase")]
    public async Task<ActionResult<object>> PurchaseSize(
        long productId,
        string size,
        [FromQuery] int quantity,
        CancellationToken cancellationToken)
    {
        var remaining = await productStockService.DecrementStockAsync(
            productId, size, quantity <= 0 ? 1 : quantity, cancellationToken);

        if (remaining is null)
        {
            return Conflict(new { message = "Not enough stock for that size." });
        }

        return Ok(new { remaining });
    }
}
