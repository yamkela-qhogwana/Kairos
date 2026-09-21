using NetTopologySuite.Geometries;

namespace Kairos.Domain.Entities;

public class Store
{
    public long StoreId { get; set; }

    // Nullable for now — vendor-dashboard auth isn't wired to the backend
    // yet, so stores can exist (e.g. seeded) without an owning account.
    public long? OwnerUserId { get; set; }
    public User? OwnerUser { get; set; }

    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    /// <summary>
    /// SQL Server `geography` point — where the shop physically is, so
    /// customers only see stores within delivery range of their address.
    /// </summary>
    public Point? Location { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
