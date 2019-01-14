namespace ChatApp.Services
{
    using ChatApp.Data.Models;
    using System.Collections.Generic;

    public interface IUserService
    {
        User ById(string id);

        User ByUsername(string username);

        List<User> All();

        void Update(string id);
    }
}
