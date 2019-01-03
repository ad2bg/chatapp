namespace ChatApp.Services
{
    using ChatApp.Data.Models;

    public interface IUserService
    {
        User ById(string id);

        void Update(string id);
    }
}
