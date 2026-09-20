namespace Kairos.Application.Auth;

public class WeakPasswordException : Exception
{
    public WeakPasswordException()
        : base("This password is too easy to guess. Please choose another.")
    {
    }
}
