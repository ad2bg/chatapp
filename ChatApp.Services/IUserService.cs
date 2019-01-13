namespace ChatApp.Services
{
    using ChatApp.Data.Models;

    public interface IUserService
    {
        User ById(string id);

        User ByUsername(string username);

        void Update(string id);
    }
}
