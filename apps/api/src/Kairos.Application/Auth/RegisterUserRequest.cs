using System.ComponentModel.DataAnnotations;

namespace Kairos.Application.Auth;

public class RegisterUserRequest
{
    [Required, MinLength(1)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string StreetAddress { get; set; } = string.Empty;

    public string? ApartmentUnit { get; set; }

    [Required, MinLength(1)]
    public string Suburb { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string City { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string PostalCode { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string PhoneNumber { get; set; } = string.Empty;
}
