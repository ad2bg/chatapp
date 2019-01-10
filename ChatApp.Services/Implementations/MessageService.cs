namespace ChatApp.Services.Implementations
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class MessageService : IMessageService
    {

        private readonly ChatAppDbContext db;

        public MessageService(ChatAppDbContext db)
        {
            this.db = db;
        }


        // ALL IN ROOM ASYNC
        public async Task<IEnumerable<Message>> AllInRoomAsync(string groupName)
        {
            return await this.db.Messages
                .Where(m => m.Room.Name == groupName)
                .OrderBy(m => m.TimeSent)
                .ToListAsync();
        }

        // CREATE ASYNC
        public async Task CreateAsync(string text, User sender, User recipient = null, Room room = null)
        {
            var message = new Message
            {
                Text = text,
                TimeSent = DateTime.UtcNow,
                Sender = sender,
                SenderId = sender.Id,
            };
            this.db.Add(message);

            if (null != recipient)
            {
                message.Recipient = recipient;
                message.RecipientId = recipient.Id;
                sender.SentMessages.Add(message);
                recipient.ReceivedMessages.Add(message);
            }

            if (null != room)
            {
                message.Room = room;
                message.RoomId = room.Id;
                sender.SentMessages.Add(message);
                room.ReceivedMessages.Add(message);
            }

            await this.db.SaveChangesAsync();
        }
    }
}
