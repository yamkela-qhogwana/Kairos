using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace Kairos.Infrastructure.Search;

public class TypesenseProductDoc
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("categorySlug")]
    public string CategorySlug { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public double Price { get; set; }

    [JsonPropertyName("isOnSale")]
    public bool IsOnSale { get; set; }

    [JsonPropertyName("rating")]
    public double Rating { get; set; }
}

// Thin REST wrapper around a self-hosted Typesense instance — this is the
// actual full-text/typo-tolerant product search engine. Ollama only decides
// *what* to search for (category/price/sale filters); Typesense does the
// fast lookup. If Typesense is unreachable, callers fall back to the
// in-memory keyword search so the search bar never fully breaks.
public class TypesenseClient
{
    private const string CollectionName = "products";
    private readonly HttpClient httpClient;

    public TypesenseClient(HttpClient httpClient, IConfiguration configuration)
    {
        this.httpClient = httpClient;
        var baseUrl = configuration["Typesense:Url"] ?? "http://localhost:8108";
        var apiKey = configuration["Typesense:ApiKey"] ?? "kairos-dev-key";

        this.httpClient.BaseAddress = new Uri(baseUrl);
        this.httpClient.DefaultRequestHeaders.Remove("X-TYPESENSE-API-KEY");
        this.httpClient.DefaultRequestHeaders.Add("X-TYPESENSE-API-KEY", apiKey);
    }

    public async Task EnsureCollectionAsync(CancellationToken cancellationToken)
    {
        var existing = await httpClient.GetAsync($"/collections/{CollectionName}", cancellationToken);
        if (existing.StatusCode == HttpStatusCode.OK)
        {
            return;
        }

        var schema = new
        {
            name = CollectionName,
            fields = new object[]
            {
                new { name = "title", type = "string" },
                new { name = "categorySlug", type = "string", facet = true },
                new { name = "price", type = "float" },
                new { name = "isOnSale", type = "bool" },
                new { name = "rating", type = "float" },
            },
            default_sorting_field = "rating",
        };

        await httpClient.PostAsJsonAsync("/collections", schema, cancellationToken);
    }

    public async Task UpsertProductsAsync(IEnumerable<TypesenseProductDoc> docs, CancellationToken cancellationToken)
    {
        var ndjson = string.Join('\n', docs.Select(d => JsonSerializer.Serialize(d)));
        if (ndjson.Length == 0)
        {
            return;
        }

        using var content = new StringContent(ndjson, Encoding.UTF8, "text/plain");
        await httpClient.PostAsync(
            $"/collections/{CollectionName}/documents/import?action=upsert",
            content,
            cancellationToken);
    }

    // Returns matching product IDs in relevance/sort order. Throws on any
    // connectivity failure — callers decide how to fall back.
    public async Task<List<long>> SearchAsync(string queryText, SearchFilters? filters, CancellationToken cancellationToken)
    {
        var filterClauses = new List<string>();
        if (!string.IsNullOrWhiteSpace(filters?.CategorySlug))
        {
            filterClauses.Add($"categorySlug:={filters.CategorySlug}");
        }

        if (filters?.MinPrice is { } minPrice)
        {
            filterClauses.Add($"price:>={minPrice}");
        }

        if (filters?.MaxPrice is { } maxPrice)
        {
            filterClauses.Add($"price:<={maxPrice}");
        }

        if (filters?.OnSaleOnly == true)
        {
            filterClauses.Add("isOnSale:=true");
        }

        var q = string.IsNullOrWhiteSpace(queryText) ? "*" : queryText;
        var query = new Dictionary<string, string>
        {
            ["q"] = q,
            ["query_by"] = "title",
            ["sort_by"] = "rating:desc",
            ["per_page"] = "30",
        };
        if (filterClauses.Count > 0)
        {
            query["filter_by"] = string.Join(" && ", filterClauses);
        }

        var queryString = string.Join('&', query.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value)}"));
        var response = await httpClient.GetAsync(
            $"/collections/{CollectionName}/documents/search?{queryString}",
            cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<SearchResponse>(cancellationToken: cancellationToken);
        return result?.Hits?
            .Select(h => h.Document?.Id)
            .Where(id => id != null)
            .Select(id => long.Parse(id!))
            .ToList() ?? new List<long>();
    }

    private class SearchResponse
    {
        [JsonPropertyName("hits")]
        public List<Hit>? Hits { get; set; }
    }

    private class Hit
    {
        [JsonPropertyName("document")]
        public Document? Document { get; set; }
    }

    private class Document
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }
}
