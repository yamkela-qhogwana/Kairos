using Kairos.Application.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IUserRegistrationService registrationService,
    IUserLoginService loginService,
    IPasswordResetService passwordResetService,
    IUserLookupService userLookupService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromBody] RegisterUserRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await registrationService.RegisterAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (EmailAlreadyRegisteredException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (WeakPasswordException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await loginService.LoginAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (InvalidCredentialsException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            await passwordResetService.ResetPasswordAsync(request, cancellationToken);
            return Ok(new { message = "Password reset successfully." });
        }
        catch (UserNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (WeakPasswordException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (PasswordRecentlyUsedException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("check-email")]
    public async Task<ActionResult<object>> CheckEmail(
        [FromQuery] string email,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { message = "Email address is required." });
        }

        var exists = await userLookupService.EmailExistsAsync(email, cancellationToken);
        return Ok(new { exists });
    }
}
