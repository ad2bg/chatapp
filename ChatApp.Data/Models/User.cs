namespace ChatApp.Data.Models
{
    using Microsoft.AspNetCore.Identity;
    using System.Collections.Generic;

    public class User : IdentityUser
    {
        // Sender -< Message
        public List<Message> SentMessages { get; set; } = new List<Message>();

        // Recipient -< Message
        public List<Message> ReceivedMessages { get; set; } = new List<Message>();

        // Owner -< Room
        public List<Room> RoomsOwned { get; set; } = new List<Room>();

        // Member >-< Room
        public List<RoomMember> RoomsMemberOf { get; set; } = new List<RoomMember>();
    }
}
