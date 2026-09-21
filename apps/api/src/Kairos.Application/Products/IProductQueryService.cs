namespace Kairos.Application.Products;

public interface IProductQueryService
{
    Task<IReadOnlyList<ProductDto>> GetProductsAsync(string? category = null, CancellationToken cancellationToken = default);
}
