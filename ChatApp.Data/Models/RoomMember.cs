namespace ChatApp.Data.Models
{
    using System;

    public class RoomMember
    {
        public Room Room { get; set; }
        public int RoomId { get; set; }

        public User Member { get; set; }
        public string MemberId { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
