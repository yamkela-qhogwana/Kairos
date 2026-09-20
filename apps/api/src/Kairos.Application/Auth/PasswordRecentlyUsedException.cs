namespace Kairos.Application.Auth;

public class PasswordRecentlyUsedException : Exception
{
    public PasswordRecentlyUsedException()
        : base("You've used that password recently. Please choose a different one.")
    {
    }
}
