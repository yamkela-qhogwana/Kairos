using Kairos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Persistence;

public class KairosDbContext(DbContextOptions<KairosDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<AddressType> AddressTypes => Set<AddressType>();
    public DbSet<PasswordHistoryEntry> PasswordHistoryEntries => Set<PasswordHistoryEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.Property(a => a.Location).HasColumnType("geography");

            entity.HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.AddressType)
                .WithMany(t => t.Addresses)
                .HasForeignKey(a => a.AddressTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // A user can't have two addresses claiming the same slot
            // (e.g. two "Primary" addresses).
            entity.HasIndex(a => new { a.UserId, a.AddressTypeId }).IsUnique();
        });

        modelBuilder.Entity<PasswordHistoryEntry>(entity =>
        {
            entity.HasOne(p => p.User)
                .WithMany(u => u.PasswordHistory)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(p => new { p.UserId, p.CreatedAt });
        });

        modelBuilder.Entity<AddressType>().HasData(
            new AddressType { AddressTypeId = 1, Name = "Primary" },
            new AddressType { AddressTypeId = 2, Name = "Secondary" },
            new AddressType { AddressTypeId = 3, Name = "Tertiary" }
        );
    }
}
