namespace Kairos.Application.Auth;

public interface IUserLoginService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
