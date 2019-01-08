namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using System.Linq;

    public class UserService : IUserService
    {
        private readonly ChatAppDbContext db;

        public UserService(ChatAppDbContext db)
        {
            this.db = db;
        }

        public User ById(string id) => 
            this.db.Users
            .Where(u => u.Id == id)
            .FirstOrDefault();

        public void Update(string id)
        {
            if (ById(id) == null) {
                return;
            }

            db.SaveChanges();
        }

    }
}
