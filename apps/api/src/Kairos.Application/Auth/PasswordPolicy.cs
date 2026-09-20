namespace Kairos.Application.Auth;

// Matches Instagram's actual rule: 6+ characters, no forced uppercase/
// number/symbol — just long enough, and not a well-known weak password.
public static class PasswordPolicy
{
    private static readonly HashSet<string> CommonWeakPasswords = new(StringComparer.OrdinalIgnoreCase)
    {
        "password", "password1", "password12", "password123",
        "123456", "1234567", "12345678", "123456789", "1234567890",
        "qwerty", "qwerty123", "qwerty12345",
        "111111", "000000", "123123",
        "abc123", "letmein", "welcome", "monkey", "dragon",
        "iloveyou", "admin", "football", "baseball",
    };

    public static bool IsWeak(string password, string email, string firstName, string lastName)
    {
        if (CommonWeakPasswords.Contains(password)) return true;
        if (password.All(char.IsDigit)) return true;
        if (password.All(char.IsLetter) && password.ToLowerInvariant().Distinct().Count() <= 2) return true;

        var emailLocalPart = email.Split('@')[0];
        if (emailLocalPart.Length >= 4 && string.Equals(password, emailLocalPart, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (!string.IsNullOrEmpty(firstName) && string.Equals(password, firstName, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (!string.IsNullOrEmpty(lastName) && string.Equals(password, lastName, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        return false;
    }
}
