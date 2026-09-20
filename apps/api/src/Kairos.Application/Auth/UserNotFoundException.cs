namespace Kairos.Application.Auth;

public class UserNotFoundException : Exception
{
    public UserNotFoundException()
        : base("No account found with that email address.")
    {
    }
}
