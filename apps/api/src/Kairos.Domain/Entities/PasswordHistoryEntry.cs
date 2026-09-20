namespace Kairos.Domain.Entities;

// Retains an account's previous password hashes so a reset can reject
// passwords the user has already used.
public class PasswordHistoryEntry
{
    public long PasswordHistoryEntryId { get; set; }

    public long UserId { get; set; }
    public User User { get; set; } = null!;

    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
