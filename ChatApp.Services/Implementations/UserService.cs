namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class UserService : IUserService
    {
        private readonly ChatAppDbContext db;

        public UserService(ChatAppDbContext db)
        {
            this.db = db;
        }

        // BY ID ASYNC
        public async Task<User> ByIdAsync(string id) =>
            await this.db.Users
            .Where(u => u.Id == id)
            .FirstOrDefaultAsync();

        // BY USERNAME ASYNC
        public async Task<User> ByUsernameAsync(string username) =>
            await this.db.Users
            .Where(u => u.UserName == username)
            .Include(u => u.RoomMembers)
            .ThenInclude(rm => rm.Room)
            .FirstOrDefaultAsync();

        // All ASYNC
        public async Task<List<User>> AllAsync() => 
            await this.db.Users
            .Include(u => u.RoomMembers)
            .ThenInclude(rm => rm.Room)
            .ToListAsync();
       
        // UPDATE ASYNC
        public async Task UpdateAsync(string id)
        {
            if (await ByIdAsync(id) == null) { return; }
            await db.SaveChangesAsync();
        }
    }
}
