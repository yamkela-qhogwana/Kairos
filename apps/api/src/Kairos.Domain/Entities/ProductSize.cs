namespace Kairos.Domain.Entities;

public class ProductSize
{
    public long ProductSizeId { get; set; }

    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Size { get; set; } = string.Empty;

    // Decremented on purchase; a size with 0 is out of stock but still
    // listed (so it can show as unavailable rather than disappearing).
    public int Quantity { get; set; }

    // Incremented alongside Quantity being decremented — the real signal
    // for "most purchased", independent of current stock level.
    public int UnitsSold { get; set; }
}
