namespace Kairos.Application.Auth;

public interface IUserRegistrationService
{
    Task<AuthResponse> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default);
}
