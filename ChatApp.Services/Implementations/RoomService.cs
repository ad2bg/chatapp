namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using System.Collections.Generic;

    public class RoomService : IRoomService
    {
        private readonly ChatAppDbContext db;

        public RoomService(ChatAppDbContext db)
        {
            this.db = db;
        }

        // CREATE
        public void Create(string name, User owner)
        {
            var room = new Room
            {
                Name = name,
                Owner = owner,
                OwnerId = owner.Id,
                ReceivedMessages = new List<Message>(),
                Members = new List<RoomMember>()
            };

            this.db.Add(room);

            var roomMember = new RoomMember() {
                Room = room,
                Member = owner
            };
            this.db.Add(roomMember);

            room.Members.Add(roomMember);
            owner.RoomsMemberOf.Add(roomMember);

            owner.RoomsOwned.Add(room);

            this.db.SaveChanges();
        }
    }
}
