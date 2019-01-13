namespace ChatApp.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ChatApp.Data.Models;

    public interface IMessageService
    {
        Task<Message> CreateAsync(
            string text,
            User sender,
            User recipient = null,
            Room room = null);

        Task<IEnumerable<Message>> AllInRoomAsync(string groupName);
        Task<IEnumerable<Message>> AllWithUserAsync(string myId, string userId);
    }
}
