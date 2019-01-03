namespace ChatApp.Services
{
    using ChatApp.Data.Models;

    public interface IMessageService
    {
        void Create(
            string text,
            User sender,
            User recipient,
            Room room);
    }
}
