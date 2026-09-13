using NetTopologySuite.Geometries;

namespace Kairos.Domain.Entities;

public class Address
{
    public long AddressId { get; set; }

    public long UserId { get; set; }
    public User User { get; set; } = null!;

    public string StreetAddress { get; set; } = string.Empty;
    public string? ApartmentUnit { get; set; }
    public string Suburb { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;

    /// <summary>
    /// SQL Server `geography` point (SRID 4326 — standard WGS84 lat/lng).
    /// Nullable until the address is geocoded.
    /// </summary>
    public Point? Location { get; set; }

    public byte AddressTypeId { get; set; }
    public AddressType AddressType { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
