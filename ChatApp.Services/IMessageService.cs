namespace ChatApp.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ChatApp.Data.Models;

    public interface IMessageService
    {
        Task CreateAsync(
            string text,
            User sender,
            User recipient,
            Room room);

        Task<IEnumerable<Message>> AllInRoomAsync(string groupName);
    }
}
