using Kairos.Application.Products;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Products;

public class CollectionQueryService(KairosDbContext dbContext) : ICollectionQueryService
{
    public async Task<IReadOnlyList<CollectionDto>> GetCollectionsAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Collections
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CollectionDto
            {
                CollectionId = c.CollectionId,
                Slug = c.Slug,
                Name = c.Name,
                Icon = c.Icon,
            })
            .ToListAsync(cancellationToken);
    }
}
