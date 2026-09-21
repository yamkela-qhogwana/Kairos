namespace Kairos.Application.Products;

public interface ICategoryQueryService
{
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);
}
