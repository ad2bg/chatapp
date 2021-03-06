﻿namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using ChatApp.Services.Models;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class RoomService : IRoomService
    {
        private readonly ChatAppDbContext db;
        //private readonly IUserService userService;

        public RoomService(
            ChatAppDbContext db
            //IUserService userService
            )
        {
            this.db = db;
            //this.userService = userService;
        }


        // EXISTS
        public bool Exists(string roomName)
        {
            var exists = false;
            Task.Run(async () => { exists = await this.db.Rooms.AnyAsync(r => r.Name == roomName); }).Wait();
            return exists;
        }


        // GET BY NAME ASYNC
        public async Task<Room> GetByNameAsync(string roomName) =>
            await this.db.Rooms
            .Where(r => r.Name == roomName)
            .Include(r => r.RoomMembers)
            .ThenInclude(rm => rm.Member)
            .FirstOrDefaultAsync();



        // CREATE ASYNC
        public async Task CreateAsync(string roomName, User owner = null)
        {
            if (this.Exists(roomName))
            {
                throw new ArgumentException("This room already exists.");
            }

            var room = new Room
            {
                Name = roomName,
                Owner = owner,
                OwnerId = owner?.Id,
                ReceivedMessages = new List<Message>(),
                RoomMembers = new List<RoomMember>()
            };

            this.db.Add(room);

            if (owner != null)
            {
                var roomMember = new RoomMember()
                {
                    Room = room,
                    Member = owner
                };
                this.db.Add(roomMember);

                room.RoomMembers.Add(roomMember);
                owner.RoomMembers.Add(roomMember);

                owner.RoomsOwned.Add(room);
            }

            await this.db.SaveChangesAsync();
        }


        // ALL ASYNC
        public async Task<IEnumerable<RoomModel>> AllAsync(string username) =>
            await db.Rooms
                .Select(r => new RoomModel
                {
                    Id = r.Id,
                    Name = r.Name,
                    OwnerId = r.OwnerId,
                    MembersCount = r.RoomMembers.Count,
                    IsMember = r.RoomMembers.Select(m => m.Member.UserName).Contains(username),
                })
                .ToListAsync();



        // ADD MEMBER
        public async Task AddMemberAsync(string groupName, User user)
        {
            var room = await this.GetByNameAsync(groupName);
            if (room == null) { throw new ArgumentException("Invalid room name: " + groupName); }
            if (user == null) { throw new ArgumentException("Invalid user"); }
            var members = await this.GetMembersAsync(groupName);
            if (members.Contains(user)) { return; }
            var roomMember = new RoomMember { Room = room, Member = user };
            room.RoomMembers.Add(roomMember);
            await this.db.SaveChangesAsync();
        }

        // REMOVE MEMBER
        public async Task RemoveMemberAsync(string groupName, User user)
        {
            var room = await this.GetByNameAsync(groupName);
            if (room == null) { throw new ArgumentException("Invalid room name: " + groupName); }
            if (user == null) { throw new ArgumentException("Invalid user"); }
            room.RoomMembers = room.RoomMembers.Where(rm => rm.Member.Id != user.Id).ToList();
            await this.db.SaveChangesAsync();
        }



        // GET MEMBERS
        public async Task<List<User>> GetMembersAsync(string groupName)
        {
            var room = await this.GetByNameAsync(groupName);
            if (room == null) { throw new ArgumentException("Invalid room name: " + groupName); }
            return room.RoomMembers.Select(rm => rm.Member).ToList();
        }

    }
}
