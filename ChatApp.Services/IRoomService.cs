namespace ChatApp.Services
{
    using ChatApp.Data.Models;

    public interface IRoomService
    {
        void Create(string name, User owner);
    }
}

