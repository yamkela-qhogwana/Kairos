using Kairos.Domain.Entities;

namespace Kairos.Application.Auth;

public interface ITokenService
{
    string GenerateToken(User user);
}
