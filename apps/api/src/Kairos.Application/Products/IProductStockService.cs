namespace Kairos.Application.Products;

public interface IProductStockService
{
    // Decrements stock for one size by `quantity` when a purchase goes
    // through. Returns the remaining quantity, or null if the product/size
    // doesn't exist or there isn't enough stock left.
    Task<int?> DecrementStockAsync(
        long productId,
        string size,
        int quantity = 1,
        CancellationToken cancellationToken = default);
}
