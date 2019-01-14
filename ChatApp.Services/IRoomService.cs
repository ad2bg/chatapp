namespace ChatApp.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ChatApp.Data.Models;
    using ChatApp.Services.Models;

    public interface IRoomService
    {
        bool Exists(string roomName);

        Task<Room> GetByNameAsync(string roomName);

        Task CreateAsync(string roomName, User owner);

        Task<IEnumerable<RoomModel>> AllAsync(string userId);

        Task AddMemberAsync(string groupName, User user);
        Task RemoveMemberAsync(string groupName, User user);

        Task<List<User>> GetMembersAsync(string groupName);
    }
}

