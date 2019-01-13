using System;

namespace ChatApp.Services.Models
{
    public class UserModel
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public bool IsOnline { get; set; }

        public DateTime OnlineAtUTC { get; set; }
    }
}
