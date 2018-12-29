namespace ChatApp.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Room
    {

        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }


        [Required]
        public User Owner { get; set; }

        [Required]
        public string OwnerId { get; set; }


        // Room -< Message
        public List<Message> ReceivedMessages { get; set; } = new List<Message>();

        // Room >-< Member
        public List<RoomMember> Members { get; set; } = new List<RoomMember>();

    }
}
