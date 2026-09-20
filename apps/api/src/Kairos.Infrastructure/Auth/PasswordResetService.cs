using Kairos.Application.Auth;
using Kairos.Domain.Entities;
using Kairos.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Auth;

public class PasswordResetService(KairosDbContext dbContext) : IPasswordResetService
{
    // How many previous passwords (including the one being replaced) a user
    // can't immediately reuse.
    private const int HistoryLimit = 5;

    private readonly PasswordHasher<User> _passwordHasher = new();

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .Include(u => u.PasswordHistory)
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (user is null)
        {
            throw new UserNotFoundException();
        }

        if (PasswordPolicy.IsWeak(request.NewPassword, normalizedEmail, user.FirstName, user.LastName))
        {
            throw new WeakPasswordException();
        }

        var recentHashes = user.PasswordHistory
            .OrderByDescending(p => p.CreatedAt)
            .Take(HistoryLimit - 1)
            .Select(p => p.PasswordHash)
            .Prepend(user.PasswordHash);

        foreach (var hash in recentHashes)
        {
            if (_passwordHasher.VerifyHashedPassword(user, hash, request.NewPassword) != PasswordVerificationResult.Failed)
            {
                throw new PasswordRecentlyUsedException();
            }
        }

        dbContext.PasswordHistoryEntries.Add(new PasswordHistoryEntry
        {
            UserId = user.UserId,
            PasswordHash = user.PasswordHash,
        });

        user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);

        var staleEntries = user.PasswordHistory
            .OrderByDescending(p => p.CreatedAt)
            .Skip(HistoryLimit - 1);
        dbContext.PasswordHistoryEntries.RemoveRange(staleEntries);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
