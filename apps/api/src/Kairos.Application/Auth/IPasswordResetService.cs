namespace Kairos.Application.Auth;

public interface IPasswordResetService
{
    Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);
}
