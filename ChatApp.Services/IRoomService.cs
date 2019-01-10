﻿namespace ChatApp.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ChatApp.Data.Models;
    using ChatApp.Services.Models;

    public interface IRoomService
    {
        bool Exists(string roomName);

        Room GetByName(string roomName);

        Task CreateAsync(string roomName, User owner);

        Task<IEnumerable<RoomModel>> AllAsync(string userId);

        void AddMember(string groupName, User user);
        void RemoveMember(string groupName, User user);

        List<User> GetMembers(string groupName);
    }
}

