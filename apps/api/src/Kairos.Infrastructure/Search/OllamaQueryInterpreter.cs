using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Kairos.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Kairos.Infrastructure.Search;

// Turns a free-text shopper query into structured filters using a locally
// hosted Ollama model — no per-query API cost. Callers must treat a null
// result as "AI unavailable" (Ollama not running, model not pulled, etc.)
// and fall back to plain keyword search — this must never be the only way
// to search the catalog.
public class OllamaQueryInterpreter(HttpClient httpClient, IConfiguration configuration)
{
    public async Task<SearchFilters?> InterpretAsync(
        string query,
        IReadOnlyList<Category> categories,
        CancellationToken cancellationToken)
    {
        var baseUrl = configuration["Ollama:Url"] ?? "http://localhost:11434";
        var model = configuration["Ollama:Model"] ?? "llama3.2";

        var categoryList = string.Join(", ", categories.Select(c => c.Slug));
        var prompt =
            $"You are a search-query interpreter for Kairos, a South African fashion marketplace. " +
            $"Valid category slugs: {categoryList}. " +
            $"Shopper's search text: \"{query}\". " +
            "Respond with ONLY a JSON object (no prose, no markdown fences) matching this exact shape: " +
            "{\"categorySlug\": string|null, \"minPrice\": number|null, \"maxPrice\": number|null, \"onSaleOnly\": boolean, \"keywords\": string[], \"interpretation\": string}. " +
            "categorySlug must be one of the valid slugs above, or null if nothing clearly matches. Prices are South African Rand. " +
            "keywords should be 1-4 short words useful for matching product titles. " +
            "interpretation is a short human-readable summary, e.g. \"Dresses under R200\".";

        var requestBody = new
        {
            model,
            prompt,
            format = "json",
            stream = false,
        };

        try
        {
            using var response = await httpClient.PostAsJsonAsync($"{baseUrl}/api/generate", requestBody, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var payload = await response.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken: cancellationToken);
            var text = payload?.Response;
            if (string.IsNullOrWhiteSpace(text))
            {
                return null;
            }

            var jsonStart = text.IndexOf('{');
            var jsonEnd = text.LastIndexOf('}');
            if (jsonStart < 0 || jsonEnd < jsonStart)
            {
                return null;
            }

            var jsonSlice = text.Substring(jsonStart, jsonEnd - jsonStart + 1);
            var parsed = JsonSerializer.Deserialize<InterpretedFilters>(
                jsonSlice,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (parsed is null)
            {
                return null;
            }

            return new SearchFilters
            {
                CategorySlug = parsed.CategorySlug,
                MinPrice = parsed.MinPrice,
                MaxPrice = parsed.MaxPrice,
                OnSaleOnly = parsed.OnSaleOnly,
                Keywords = parsed.Keywords ?? new List<string>(),
                Interpretation = parsed.Interpretation,
            };
        }
        catch
        {
            // Ollama not running, model not pulled, timeout, malformed
            // response — degrade to keyword search rather than fail.
            return null;
        }
    }

    private class OllamaResponse
    {
        [JsonPropertyName("response")]
        public string? Response { get; set; }
    }

    private class InterpretedFilters
    {
        public string? CategorySlug { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool OnSaleOnly { get; set; }
        public List<string>? Keywords { get; set; }
        public string? Interpretation { get; set; }
    }
}
