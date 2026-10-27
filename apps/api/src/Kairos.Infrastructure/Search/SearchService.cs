using Kairos.Application.Products;
using Kairos.Application.Search;
using Kairos.Domain.Entities;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Search;

public class SearchService(KairosDbContext dbContext, LuceneSearchIndex searchIndex) : ISearchService
{
    public async Task<SearchResultDto> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        var trimmedQuery = query.Trim();
        if (trimmedQuery.Length == 0)
        {
            return new SearchResultDto { Products = Array.Empty<ProductDto>() };
        }

        var keywords = trimmedQuery
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();

        var orderedIds = searchIndex.Search(keywords);
        var products = await LoadProductsInOrderAsync(orderedIds, cancellationToken);
        var correctedQuery = DeriveCorrectedQuery(keywords, products);

        return new SearchResultDto
        {
            Interpretation = correctedQuery is not null
                ? $"Showing results for \"{correctedQuery}\""
                : $"Results for \"{trimmedQuery}\"",
            CorrectedQuery = correctedQuery,
            Products = products.Select(MapToDto).ToList(),
        };
    }

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

        var productMatches = await dbContext.Products
            .Where(p => p.IsActive && p.Title.Contains(trimmedQuery))
            .OrderByDescending(p => p.Rating)
            .Take(6)
            .Select(p => p.Title)
            .ToListAsync(cancellationToken);

        var suggestions = new List<SearchSuggestionDto>();
        var seenText = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var name in categoryMatches)
        {
            if (seenText.Add(name))
            {
                suggestions.Add(new SearchSuggestionDto { Text = name, Type = "category" });
            }
        }

        foreach (var title in productMatches)
        {
            if (suggestions.Count >= 8)
            {
                break;
            }
            if (seenText.Add(title))
            {
                suggestions.Add(new SearchSuggestionDto { Text = title, Type = "product" });
            }
        }

        return suggestions;
    }

    private async Task<List<Product>> LoadProductsInOrderAsync(IReadOnlyList<long> orderedIds, CancellationToken cancellationToken)
    {
        var byId = await dbContext.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Subcategory)
            .Include(p => p.Images)
            .Include(p => p.Sale)
            .Include(p => p.Sizes)
            .Where(p => p.IsActive && orderedIds.Contains(p.ProductId))
            .AsSplitQuery()
            .ToDictionaryAsync(p => p.ProductId, cancellationToken);

        return orderedIds.Where(byId.ContainsKey).Select(id => byId[id]).ToList();
    }

    // Only ever suggests a word that actually appears in the products being
    // returned, so the display text can never disagree with the results —
    // unlike a separate spell-checker pass, which can "correct" to a word
    // that has nothing to do with what was actually matched.
    private static string? DeriveCorrectedQuery(List<string> keywords, List<Product> products)
    {
        if (products.Count == 0)
        {
            return null;
        }

        var resultWords = products
            .SelectMany(p => $"{p.Title} {p.Category.Name}".Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .Select(w => w.Trim(',', '.', '&', '\'').ToLowerInvariant())
            .Where(w => w.Length > 0)
            .Distinct()
            .ToList();

        var changed = false;
        var corrected = new List<string>(keywords.Count);

        foreach (var keyword in keywords)
        {
            var lower = keyword.ToLowerInvariant();

            if (resultWords.Any(w => w.Contains(lower) || lower.Contains(w)))
            {
                corrected.Add(keyword);
                continue;
            }

            var maxDistance = lower.Length <= 4 ? 1 : lower.Length <= 7 ? 2 : 3;
            var best = resultWords
                .Select(w => (word: w, distance: LevenshteinDistance(lower, w)))
                .Where(m => m.distance <= maxDistance)
                .OrderBy(m => m.distance)
                .FirstOrDefault();

            if (best.word is not null)
            {
                corrected.Add(best.word);
                changed = true;
            }
            else
            {
                corrected.Add(keyword);
            }
        }

        return changed ? string.Join(' ', corrected) : null;
    }

    private static int LevenshteinDistance(string a, string b)
    {
        var lenA = a.Length;
        var lenB = b.Length;
        var dp = new int[lenA + 1, lenB + 1];

        for (var i = 0; i <= lenA; i++) dp[i, 0] = i;
        for (var j = 0; j <= lenB; j++) dp[0, j] = j;

        for (var i = 1; i <= lenA; i++)
        {
            for (var j = 1; j <= lenB; j++)
            {
                var cost = a[i - 1] == b[j - 1] ? 0 : 1;
                dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1), dp[i - 1, j - 1] + cost);
            }
        }

        return dp[lenA, lenB];
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        ProductId = p.ProductId,
        Title = p.Title,
        Description = p.Description,
        CategoryId = p.CategoryId,
        CategorySlug = p.Category.Slug,
        CategoryName = p.Category.Name,
        SubcategorySlug = p.Subcategory?.Slug,
        SubcategoryName = p.Subcategory?.Name,
        Sizes = p.Sizes.Select(s => new ProductSizeDto { Size = s.Size, Quantity = s.Quantity, UnitsSold = s.UnitsSold }).ToList(),
        OriginalPrice = p.OriginalPrice,
        SalePrice = p.SalePrice,
        DiscountPercentage = p.DiscountPercentage,
        IsOnSale = p.SalePrice != null && p.SalePrice < p.OriginalPrice,
        SaleEndsAt = p.Sale != null ? p.Sale.EndDate : null,
        Rating = p.Rating,
        IsRentable = p.IsRentable,
        IsLuxe = p.IsLuxe,
        Images = p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
        StoreId = p.StoreId,
        StoreName = p.Store.Name,
    };
}
