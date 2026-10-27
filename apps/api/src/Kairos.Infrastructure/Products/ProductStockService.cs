using Kairos.Application.Products;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Products;

public class ProductStockService(KairosDbContext dbContext) : IProductStockService
{
    public async Task<int?> DecrementStockAsync(
        long productId,
        string size,
        int quantity = 1,
        CancellationToken cancellationToken = default)
    {
        var productSize = await dbContext.ProductSizes
            .FirstOrDefaultAsync(ps => ps.ProductId == productId && ps.Size == size, cancellationToken);

        if (productSize is null || productSize.Quantity < quantity)
        {
            return null;
        }

        productSize.Quantity -= quantity;
        productSize.UnitsSold += quantity;
        await dbContext.SaveChangesAsync(cancellationToken);
        return productSize.Quantity;
    }
}
