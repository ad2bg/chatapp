namespace ChatApp.Services
{
    using ChatApp.Data.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IUserService
    {
        Task<User> ByIdAsync(string id);

        Task<User> ByUsernameAsync(string username);

        Task<List<User>> AllAsync();

        Task UpdateAsync(string id);
    }
}
