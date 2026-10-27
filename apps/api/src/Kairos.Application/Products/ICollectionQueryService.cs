namespace Kairos.Application.Products;

public interface ICollectionQueryService
{
    Task<IReadOnlyList<CollectionDto>> GetCollectionsAsync(CancellationToken cancellationToken = default);
}
