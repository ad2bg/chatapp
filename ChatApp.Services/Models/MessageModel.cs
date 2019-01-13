namespace ChatApp.Services.Models
{
    using ChatApp.Data.Models;
    using System;

    public class MessageModel
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime TimeSent { get; set; }

        public UserModel Sender { get; set; }

        //public string SenderId { get; set; }

        //public string RecipientId { get; set; }

        //public int RoomId { get; set; }
    }
}
