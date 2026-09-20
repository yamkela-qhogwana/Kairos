using Kairos.Application.Auth;
using Kairos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Auth;

public class UserLookupService(KairosDbContext dbContext) : IUserLookupService
{
    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return dbContext.Users.AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
    }
}
