using Kairos.Application.Auth;
using Kairos.Domain.Entities;
using Kairos.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Auth;

public class UserRegistrationService(KairosDbContext dbContext, ITokenService tokenService) : IUserRegistrationService
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public async Task<AuthResponse> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var emailTaken = await dbContext.Users
            .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (emailTaken)
        {
            throw new EmailAlreadyRegisteredException(normalizedEmail);
        }

        if (PasswordPolicy.IsWeak(request.Password, normalizedEmail, request.FirstName.Trim(), request.LastName.Trim()))
        {
            throw new WeakPasswordException();
        }

        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PhoneNumber = request.PhoneNumber.Trim(),
            PhoneVerified = true,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        user.Addresses.Add(new Address
        {
            StreetAddress = request.StreetAddress.Trim(),
            ApartmentUnit = string.IsNullOrWhiteSpace(request.ApartmentUnit) ? null : request.ApartmentUnit.Trim(),
            Suburb = request.Suburb.Trim(),
            City = request.City.Trim(),
            PostalCode = request.PostalCode.Trim(),
            AddressTypeId = 1, // Primary
        });

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new AuthResponse
        {
            Token = tokenService.GenerateToken(user),
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
        };
    }
}
