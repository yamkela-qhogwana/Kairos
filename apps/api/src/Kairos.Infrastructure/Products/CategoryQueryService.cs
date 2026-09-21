using Kairos.Application.Products;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Products;

public class CategoryQueryService(KairosDbContext dbContext) : ICategoryQueryService
{
    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Slug = c.Slug,
                Name = c.Name,
            })
            .ToListAsync(cancellationToken);
    }
}
