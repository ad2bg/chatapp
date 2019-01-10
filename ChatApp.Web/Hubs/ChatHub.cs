namespace ChatApp.Web.Hubs
{
    using ChatApp.Data.Models;
    using ChatApp.Services;
    using ChatApp.Services.Models;
    using ChatApp.Web.Infrastructure;
    using ChatApp.Web.Infrastructure.Filters;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [MeasureTime]
    public class ChatHub : Hub
    {
        const string you = "You";

        // Client-side methods
        const string getData = "getData";
        const string youAre = "youAre";
        const string userOnline = "userOnline";
        const string userOffline = "userOffline";
        const string receiveMessage = "receiveMessage";
        const string notify = "notify";
        const string refreshRooms = "refreshRooms";
        const string refreshUsers = "refreshUsers";
        const string refreshMessages = "refreshMessages";

        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly IRoomService roomService;
        private readonly IMessageService messageService;

        private static Dictionary<string, string> connectionIds = new Dictionary<string, string>();

        public ChatHub(
            UserManager<User> userManager,
            IUserService userService,
            IRoomService roomService,
            IMessageService messageService
            )
        {
            this.userManager = userManager;
            this.userService = userService;
            this.roomService = roomService;
            this.messageService = messageService;
        }



        // ADD TO CONNECTION IDs DICT
        private void AddToConnectionIds(string username)
        {
            connectionIds[username] = Context.ConnectionId;
        }

        // REMOVE FROM CONNECTION IDs DICT
        private void RemoveFromConnectionIds(string username)
        {
            connectionIds.Remove(username);
        }

        // ONLINE
        public override Task OnConnectedAsync()
        {

            string username = Context.User.Identity.Name;
            if (username != null)
            {
                AddToConnectionIds(username);
                Clients.Caller.SendAsync(userOnline, you);
                Clients.Others.SendAsync(userOnline, username);
            }
            return base.OnConnectedAsync();
        }

        // OFFLINE
        public override Task OnDisconnectedAsync(Exception exception)
        {
            string username = Context.User.Identity.Name;
            if (username != null)
            {
                RemoveFromConnectionIds(username);
                Clients.All.SendAsync(userOffline, username);
            }
            return base.OnDisconnectedAsync(exception);
        }


        // SEND PUBLIC MESSAGE
        public async Task SendPublicMessage(string message)
        {
            var username = Context.User.Identity.Name; // sender username
            var user = await this.userManager.FindByNameAsync(username);
            // store in DB
            await this.messageService.CreateAsync(message, user, null, null);
            // push to clients
            if (username != null)
            {
                await Clients.Caller.SendAsync(receiveMessage, you, message);
                await Clients.Others.SendAsync(receiveMessage, username, message);
            }
        }

        // SEND MESSAGE TO GROUP
        public async Task SendMessageToGroup(string groupName, string message)
        {
            string username = Context.User.Identity.Name; // sender username
            var sender = await this.userManager.FindByNameAsync(username);
            var room = this.roomService.GetByName(groupName);
            // store in DB
            await this.messageService.CreateAsync(message, sender, null, room);
            // push to clients
            if (username != null)
            {
                await Clients.Caller.SendAsync(receiveMessage, you, message);
                await Clients.OthersInGroup(groupName).SendAsync(receiveMessage, username, message);
            }
        }

        // SEND PRIVATE MESSAGE
        public async Task SendPrivateMessage(string recipientUsername, string message)
        {
            string username = Context.User.Identity.Name; // sender username
            var sender = await this.userManager.FindByNameAsync(username);
            var recipient = await this.userManager.FindByNameAsync(recipientUsername);
            // store in DB
            await this.messageService.CreateAsync(message, sender, recipient, null);
            // push to clients
            if (username != null && connectionIds.ContainsKey(recipientUsername))
            {
                await Clients.Client(connectionIds[recipientUsername]).SendAsync(receiveMessage, username, message);
            }
        }

        // GET DATA
        public async Task GetData()
        {
            var connectionId = Context.ConnectionId;
            var username = Context.User.Identity.Name;

            await Clients.Caller.SendAsync(youAre, username);

            if (!this.roomService.Exists(GlobalConstants.PublicRoomName))
            {
                await this.roomService.CreateAsync(GlobalConstants.PublicRoomName, null);
            }
            var rooms = await this.roomService.AllAsync(username);
            await Clients.Caller.SendAsync(refreshRooms, rooms);
        }

        // CREATE ROOM
        public async Task CreateRoom(string groupName)
        {
            var connectionId = Context.ConnectionId;
            var username = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(username);
            try
            {
                await this.roomService.CreateAsync(groupName, user);
                await Groups.AddToGroupAsync(connectionId, groupName);

                await Clients.Caller.SendAsync(notify, $"{you} created room {groupName}.");
                await Clients.All.SendAsync(getData);
                await Clients.Others.SendAsync(notify, $"{username} created room {groupName}.");
            }
            catch (ArgumentException e)
            {
                await Clients.Caller.SendAsync(notify, e.Message);
            }
        }

        // OPEN ROOM
        public async Task OpenRoom(string groupName)
        {
            string username = Context.User.Identity.Name; // caller username
            // show users
            var userModels = this.roomService.GetMembers(groupName).Select(u => new UserModel
            {
                Id = u.Id,
                Username = u.UserName
            });
            await Clients.Caller.SendAsync(refreshUsers, userModels.Where(m=> m.Username != username));
            // show messages
            var messages = await this.messageService.AllInRoomAsync(groupName);
            await Clients.Caller.SendAsync(refreshMessages, messages);
        }

        // JOIN ROOM
        public async Task JoinRoom(string groupName)
        {
            var username = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(username);
            // add the user as a room member in the DB
            this.roomService.AddMember(groupName, user);
            // add the connection to the group
            var connectionId = Context.ConnectionId;
            await Groups.AddToGroupAsync(connectionId, groupName);
            // notify all room members
            var userModels = this.roomService.GetMembers(groupName).Select(u => new UserModel
            {
                Id = u.Id,
                Username = u.UserName
            });
            await Clients.OthersInGroup(groupName).SendAsync(refreshUsers, userModels);
            // getData
            await Clients.Caller.SendAsync(getData);
        }

        // LEAVE ROOM
        public async Task LeaveRoom(string groupName)
        {
            var username = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(username);
            // remove the user as a room member in the DB
            this.roomService.RemoveMember(groupName, user);
            // remove the connection from the group
            var connectionId = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(connectionId, groupName);
            // notify all room members
            var userModels = this.roomService.GetMembers(groupName).Select(u => new UserModel
            {
                Id = u.Id,
                Username = u.UserName
            });
            await Clients.Group(groupName).SendAsync(refreshUsers, userModels);
            // getData
            await Clients.Caller.SendAsync(getData);
        }
    }
}
