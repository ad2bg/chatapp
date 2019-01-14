namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;

    public class UserService : IUserService
    {
        private readonly ChatAppDbContext db;

        public UserService(
            ChatAppDbContext db
            )
        {
            this.db = db;
        }


        // BY ID
        public User ById(string id) =>
            this.db.Users
            .Where(u => u.Id == id)
            .FirstOrDefault();


        // BY USERNAME
        public User ByUsername(string username) =>
            this.db.Users
            .Where(u => u.UserName == username)
            .Include(u => u.RoomMembers)
            .ThenInclude(rm => rm.Room)
            .FirstOrDefault();

        // All
        public List<User> All() => 
            this.db.Users
            .Include(u => u.RoomMembers)
            .ThenInclude(rm => rm.Room)
            .ToList();
        


        // UPDATE
        public void Update(string id)
        {
            if (ById(id) == null) { return; }
            db.SaveChanges();
        }

    }
}
