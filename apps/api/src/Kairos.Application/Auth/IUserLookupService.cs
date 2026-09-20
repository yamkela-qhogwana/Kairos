namespace Kairos.Application.Auth;

public interface IUserLookupService
{
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
}
