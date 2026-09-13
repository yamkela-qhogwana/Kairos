namespace Kairos.Domain.Entities;

/// <summary>
/// Lookup table: Primary (1), Secondary (2), Tertiary (3). Seeded once,
/// never modified at runtime.
/// </summary>
public class AddressType
{
    public byte AddressTypeId { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}
