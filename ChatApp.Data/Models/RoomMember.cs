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

        //public RoomMember(Room room, User member)
        //{
        //    this.Room = room;
        //    //this.RoomId = room.Id;
        //    this.Member = member;
        //    //this.MemberId = member.Id;
        //    //this.JoinedAt = DateTime.UtcNow;
        //}
    }
}
