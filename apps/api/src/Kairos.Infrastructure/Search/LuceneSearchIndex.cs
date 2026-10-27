using Kairos.Infrastructure.Persistence;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Search;

// Embedded Lucene index over the product catalog — runs in-process inside the
// API, no separate service, nothing that can crash independently (this is
// what replaced the self-hosted Typesense container, which kept segfaulting).
// Rebuilt from the database at startup; small/medium catalogs easily fit in
// memory (RAMDirectory), so there's no on-disk index to keep in sync.
public class LuceneSearchIndex
{
    private const LuceneVersion Version = LuceneVersion.LUCENE_48;

    private readonly object _lock = new();
    private RAMDirectory _directory = new();

    public async Task RebuildAsync(KairosDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var products = await dbContext.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .Select(p => new { p.ProductId, p.Title, CategoryName = p.Category.Name })
            .ToListAsync(cancellationToken);

        var analyzer = new StandardAnalyzer(Version);
        var newDirectory = new RAMDirectory();

        using (var writer = new IndexWriter(newDirectory, new IndexWriterConfig(Version, analyzer)))
        {
            foreach (var p in products)
            {
                writer.AddDocument(new Document
                {
                    new StringField("id", p.ProductId.ToString(), Field.Store.YES),
                    new TextField("title", p.Title, Field.Store.NO),
                    new TextField("category", p.CategoryName, Field.Store.NO),
                });
            }
            writer.Commit();
        }

        lock (_lock)
        {
            _directory = newDirectory;
        }
    }

    // Fuzzy-searches title/category for the given keywords and returns
    // matching product ids ranked by relevance. Any "what did you actually
    // search for" display text is derived by the caller from the real
    // matched products, not guessed here — keeps the two in agreement.
    public IReadOnlyList<long> Search(IReadOnlyList<string> keywords, int take = 30)
    {
        RAMDirectory directory;
        lock (_lock)
        {
            directory = _directory;
        }

        using var reader = DirectoryReader.Open(directory);
        var searcher = new IndexSearcher(reader);

        var top = new BooleanQuery();

        foreach (var rawKeyword in keywords)
        {
            var keyword = rawKeyword.ToLowerInvariant();
            var titleTerm = new Term("title", keyword);
            var categoryTerm = new Term("category", keyword);

            var perKeyword = new BooleanQuery();
            if (keyword.Length > 2)
            {
                perKeyword.Add(new FuzzyQuery(titleTerm, 2, 1), Occur.SHOULD);
                perKeyword.Add(new FuzzyQuery(categoryTerm, 2, 1), Occur.SHOULD);
            }
            else
            {
                perKeyword.Add(new TermQuery(titleTerm), Occur.SHOULD);
                perKeyword.Add(new TermQuery(categoryTerm), Occur.SHOULD);
            }
            top.Add(perKeyword, Occur.SHOULD);
        }

        var topDocs = searcher.Search(top, take);
        return topDocs.ScoreDocs
            .Select(sd => long.Parse(searcher.Doc(sd.Doc).Get("id")))
            .ToList();
    }
}
