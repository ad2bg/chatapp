namespace ChatApp.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Message
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(10000)]
        public string Text { get; set; }

        [Required]
        public DateTime TimeSent { get; set; } = new DateTime();


        [Required]
        public User Sender { get; set; }

        public string SenderId { get; set; }



        public User Recipient { get; set; }

        public string RecipientId { get; set; }



        public Room Room { get; set; }

        public int? RoomId { get; set; }
    }
}
