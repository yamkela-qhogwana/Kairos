using Kairos.Application.Products;
using Kairos.Application.Search;
using Kairos.Domain.Entities;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Search;

public class SearchService(
    KairosDbContext dbContext,
    OllamaQueryInterpreter queryInterpreter,
    TypesenseClient typesenseClient) : ISearchService
{
    public async Task<SearchResultDto> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        var trimmedQuery = query.Trim();
        if (trimmedQuery.Length == 0)
        {
            return new SearchResultDto { Products = Array.Empty<ProductDto>() };
        }

        var categories = await dbContext.Categories.Where(c => c.IsActive).ToListAsync(cancellationToken);
        var filters = await queryInterpreter.InterpretAsync(trimmedQuery, categories, cancellationToken);
        var keywordText = filters?.Keywords.Count > 0 ? string.Join(' ', filters.Keywords) : trimmedQuery;

        List<Product> matchedProducts;
        try
        {
            var orderedIds = await typesenseClient.SearchAsync(keywordText, filters, cancellationToken);

            // The AI's category/price guess can be wrong (it doesn't actually
            // know our catalog — e.g. it may not know "Cellini" is a Rolex
            // watch line and guess "jewellery" instead), which would
            // otherwise silently filter out a real title match. If the
            // filtered search comes back empty, retry on keywords alone
            // before giving up.
            if (orderedIds.Count == 0 && filters is not null)
            {
                orderedIds = await typesenseClient.SearchAsync(keywordText, null, cancellationToken);
            }

            matchedProducts = await LoadProductsInOrderAsync(orderedIds, cancellationToken);
        }
        catch
        {
            // Typesense unreachable/not indexed yet — fall back to a plain
            // in-memory keyword match so search still works.
            matchedProducts = await FallbackKeywordSearchAsync(trimmedQuery, filters, cancellationToken);
        }

        return new SearchResultDto
        {
            Interpretation = filters?.Interpretation ?? $"Results for \"{trimmedQuery}\"",
            Products = matchedProducts.Select(MapToDto).ToList(),
        };
    }

    // No LLM call here on purpose — this runs on every keystroke, so it has
    // to be fast. Typesense's own typo-tolerant prefix search is enough for
    // a live suggestions dropdown. Every suggestion is grounded in real
    // catalog data (an actual category name or an actual product title) —
    // nothing here is invented.
    public async Task<IReadOnlyList<SearchSuggestionDto>> SuggestAsync(string query, CancellationToken cancellationToken = default)
    {
        var trimmedQuery = query.Trim();
        if (trimmedQuery.Length < 2)
        {
            return Array.Empty<SearchSuggestionDto>();
        }

        var categoryMatches = await dbContext.Categories
            .Where(c => c.IsActive && EF.Functions.Like(c.Name, $"%{trimmedQuery}%"))
            .OrderBy(c => c.Name)
            .Take(3)
            .Select(c => c.Name)
            .ToListAsync(cancellationToken);

        List<Product> productMatches;
        try
        {
            var orderedIds = await typesenseClient.SearchAsync(trimmedQuery, null, cancellationToken);
            productMatches = await LoadProductsInOrderAsync(orderedIds.Take(6).ToList(), cancellationToken);
        }
        catch
        {
            productMatches = await dbContext.Products
                .Include(p => p.Store)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.Title.Contains(trimmedQuery))
                .OrderByDescending(p => p.Rating)
                .Take(6)
                .ToListAsync(cancellationToken);
        }

        var suggestions = new List<SearchSuggestionDto>();
        var seenText = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var name in categoryMatches)
        {
            if (seenText.Add(name))
            {
                suggestions.Add(new SearchSuggestionDto { Text = name, Type = "category" });
            }
        }

        foreach (var product in productMatches)
        {
            if (suggestions.Count >= 8)
            {
                break;
            }
            if (seenText.Add(product.Title))
            {
                suggestions.Add(new SearchSuggestionDto { Text = product.Title, Type = "product" });
            }
        }

        return suggestions;
    }

    private async Task<List<Product>> LoadProductsInOrderAsync(List<long> orderedIds, CancellationToken cancellationToken)
    {
        var byId = await dbContext.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.IsActive && orderedIds.Contains(p.ProductId))
            .ToDictionaryAsync(p => p.ProductId, cancellationToken);

        return orderedIds.Where(byId.ContainsKey).Select(id => byId[id]).ToList();
    }

    private async Task<List<Product>> FallbackKeywordSearchAsync(
        string trimmedQuery,
        SearchFilters? filters,
        CancellationToken cancellationToken)
    {
        var keywords = filters?.Keywords.Count > 0
            ? filters.Keywords
            : trimmedQuery
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();

        var productsQuery = dbContext.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(filters?.CategorySlug))
        {
            productsQuery = productsQuery.Where(p => p.Category.Slug == filters.CategorySlug);
        }

        if (filters?.MinPrice is { } minPrice)
        {
            productsQuery = productsQuery.Where(p => (p.SalePrice ?? p.OriginalPrice) >= minPrice);
        }

        if (filters?.MaxPrice is { } maxPrice)
        {
            productsQuery = productsQuery.Where(p => (p.SalePrice ?? p.OriginalPrice) <= maxPrice);
        }

        if (filters?.OnSaleOnly == true)
        {
            productsQuery = productsQuery.Where(p => p.SalePrice != null && p.SalePrice < p.OriginalPrice);
        }

        var candidates = await productsQuery.ToListAsync(cancellationToken);

        if (keywords.Count > 0)
        {
            var filtered = candidates
                .Where(p => keywords.Any(k => p.Title.Contains(k, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            // Same "AI's filter may be wrong" safety net as the Typesense
            // path: if the category/price filters plus keywords produced
            // nothing, retry on keywords alone against the full catalog.
            if (filtered.Count == 0 && filters is not null)
            {
                var allActive = await dbContext.Products
                    .Include(p => p.Store)
                    .Include(p => p.Category)
                    .Include(p => p.Images)
                    .Where(p => p.IsActive)
                    .ToListAsync(cancellationToken);
                filtered = allActive
                    .Where(p => keywords.Any(k => p.Title.Contains(k, StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            candidates = filtered;
        }

        return candidates.OrderByDescending(p => p.Rating).Take(30).ToList();
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        ProductId = p.ProductId,
        Title = p.Title,
        Description = p.Description,
        CategoryId = p.CategoryId,
        CategorySlug = p.Category.Slug,
        CategoryName = p.Category.Name,
        OriginalPrice = p.OriginalPrice,
        SalePrice = p.SalePrice,
        DiscountPercentage = p.DiscountPercentage,
        IsOnSale = p.SalePrice != null && p.SalePrice < p.OriginalPrice,
        Rating = p.Rating,
        Images = p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
        StoreId = p.StoreId,
        StoreName = p.Store.Name,
    };
}
