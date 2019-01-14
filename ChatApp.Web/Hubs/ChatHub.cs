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
        const int disconnectTolerance = 3000;

        // Client-side methods
        const string getData = "getData";
        const string youAre = "youAre";
        const string notify = "notify";
        const string userOnline = "userOnline";
        const string userOffline = "userOffline";
        const string pushRooms = "pushRooms";
        const string pushUsers = "pushUsers";
        const string pushMessages = "pushMessages";
        const string pushMessage = "pushMessage";

        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly IRoomService roomService;
        private readonly IMessageService messageService;

        private static Dictionary<string, User> usersOnline = new Dictionary<string, User>();       // username => user
        private static Dictionary<string, DateTime> timesUTC = new Dictionary<string, DateTime>();  // username => UTC time of coming online
        private static Dictionary<string, string> connectionIds = new Dictionary<string, string>(); // username => connectionId
        private static Dictionary<string, string> disconnected = new Dictionary<string, string>();  // username => connectionId


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



        // CONNECTED
        public override Task OnConnectedAsync()
        {
            try
            {
                DateTime? now = DateTime.UtcNow; // UTC!

                // get user
                string myUsername = Context.User.Identity.Name;
                var user = this.userService.ByUsername(myUsername);
                var connectionId = Context.ConnectionId;

                if (myUsername != null)
                {
                    if (disconnected.ContainsKey(myUsername))
                    {
                        disconnected.Remove(myUsername);// cancel going offline
                        now = null; // clear the current time as the user is already online (it's just a small disconnect-reconnect)
                    }

                    if (!usersOnline.ContainsKey(myUsername))
                    {
                        // mark online
                        usersOnline[myUsername] = user;
                        if (now != null) { timesUTC[myUsername] = (DateTime)now; }
                        connectionIds[myUsername] = connectionId;

                        // connect to groups
                        var roomNames = user.RoomMembers.Select(rm => rm.Room.Name).ToList();
                        Task.Run(async () =>
                        {
                            foreach (var roomName in roomNames)
                            {
                                try
                                {
                                    await this.JoinRoom(roomName);
                                }
                                catch (Exception)
                                {
                                    Console.WriteLine($"Error connecting {myUsername} to group {roomName}.");
                                }
                            }
                        }).Wait();
                    }


                    // push to clients  (in user's groups)
                    var userModel = GetUserModel(user);
                    foreach (var roomName in user.RoomMembers.Select(rm => rm.Room.Name))
                    {
                        Clients.Group(roomName).SendAsync(userOnline, userModel);
                    }
                    //Clients.All.SendAsync(userOnline, userModel);  //  notify ALL users

                    Console.WriteLine($"ONLINE - {connectionId} - {myUsername}");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error connecting: {e.Message}");
            }
            return base.OnConnectedAsync();
        }

        // DISCONNECTED
        public override Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                string myUsername = Context.User.Identity.Name;
                var connectionId = Context.ConnectionId;
                disconnected[myUsername] = connectionId;

                if (myUsername != null)
                {
                    Task.Delay(disconnectTolerance).ContinueWith(t => GoOffline(myUsername));
                }

                Console.WriteLine($"~~~~~~ - {connectionId} - {myUsername}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error disconnecting: {e.Message}");
            }
            return base.OnDisconnectedAsync(exception);
        }

        // go offline
        private void GoOffline(string username)
        {
            if (username == null) { return; }
            if (!disconnected.ContainsKey(username)) { return; } // the user has reconnected within the disconnectTolerance

            try
            {
                // mark offline
                usersOnline.Remove(username);
                timesUTC.Remove(username);
                connectionIds.Remove(username);

                // push to clients
                Clients.All.SendAsync(userOffline, username);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error going offline: {e.Message}");
            }
            Console.WriteLine($"OFFLINE - {username}");
        }



        // GET DATA
        public async Task GetData()
        {
            var connectionId = Context.ConnectionId;
            var myUsername = Context.User.Identity.Name;
            // send youAre
            await Clients.Caller.SendAsync(youAre, myUsername);
            // if no Public room exists -> create it
            if (!this.roomService.Exists(GlobalConstants.PublicRoomName))
            {
                await this.roomService.CreateAsync(GlobalConstants.PublicRoomName, null);
            }
            // push rooms
            var rooms = await this.roomService.AllAsync(myUsername);
            await Clients.Caller.SendAsync(pushRooms, rooms);
        }

        // CREATE ROOM
        public async Task CreateRoom(string groupName)
        {
            var connectionId = Context.ConnectionId;
            var myUsername = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(myUsername);
            try
            {
                await this.roomService.CreateAsync(groupName, user);
                await Groups.AddToGroupAsync(connectionId, groupName);

                await Clients.All.SendAsync(getData);
                await Clients.All.SendAsync(notify, $"{myUsername} created room {groupName}.");
            }
            catch (ArgumentException e)
            {
                await Clients.Caller.SendAsync(notify, e.Message);
            }
        }


        // JOIN ROOM
        public async Task JoinRoom(string groupName)
        {
            var myUsername = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(myUsername);
            // add the user as a room member in the DB
            this.roomService.AddMember(groupName, user);
            // add the connection to the group
            var connectionId = Context.ConnectionId;
            await Groups.AddToGroupAsync(connectionId, groupName);
            // notify all room members
            var userModels = this.roomService
                .GetMembers(groupName)
                .Select(u => GetUserModel(u))
                .OrderBy(m => m.Username);
            await Clients.OthersInGroup(groupName).SendAsync(pushUsers, userModels);
            // getData
            await Clients.Caller.SendAsync(getData);
        }

        // LEAVE ROOM
        public async Task LeaveRoom(string groupName)
        {
            var myUsername = Context.User.Identity.Name;
            var user = await this.userManager.FindByNameAsync(myUsername);
            // remove the user as a room member in the DB
            this.roomService.RemoveMember(groupName, user);
            // remove the connection from the group
            var connectionId = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(connectionId, groupName);
            // notify all room members
            var userModels = this.roomService.GetMembers(groupName).Select(u => GetUserModel(u));
            await Clients.Group(groupName).SendAsync(pushUsers, userModels);
            // getData
            await Clients.Caller.SendAsync(getData);
        }


        // PUSH ALL USERS
        public async Task PushAllUsers()
        {
            var myUsername = Context.User.Identity.Name; // caller username
            var users = this.userService.All();
            var userModels = users.Select(u => GetUserModel(u));
            await Clients.Caller.SendAsync(pushUsers, userModels);
        }

        // PUSH ROOM MEMBERS
        public async Task PushRoomMembers(string groupName)
        {
            var myUsername = Context.User.Identity.Name; // caller username
            var users = this.roomService.GetMembers(groupName);
            var userModels = users.Select(u => GetUserModel(u));
            await Clients.Caller.SendAsync(pushUsers, userModels);
        }

        // PUSH ROOM MESSAGES
        public async Task PushRoomMessages(string groupName)
        {
            var messages = await this.messageService.AllInRoomAsync(groupName);
            var messageModels = messages.Select(m => GetMessageModel(m));
            await Clients.Caller.SendAsync(pushMessages, messageModels);
        }

        // PUSH USER MESSAGES
        public async Task PushUserMessages(string username)
        {
            string myUsername = Context.User.Identity.Name; // caller username
            var myself = await this.userManager.FindByNameAsync(myUsername);
            var partner = await this.userManager.FindByNameAsync(username);

            // show messages
            var messages = await this.messageService.AllWithUserAsync(myself.Id, partner.Id);
            await Clients.Caller.SendAsync(pushMessages, messages.Select(m => GetMessageModel(m)));
        }






        // SEND PUBLIC MESSAGE
        public async Task SendPublicMessage(string messageText)
        {
            var myUsername = Context.User.Identity.Name; // sender username
            var user = await this.userManager.FindByNameAsync(myUsername);
            // store in DB
            var message = await this.messageService.CreateAsync(messageText, user, null, null);
            // push to clients
            if (myUsername != null)
            {
                var messageModel = GetMessageModel(message);
                await Clients.All.SendAsync(pushMessage, messageModel);
            }
        }

        // SEND MESSAGE TO GROUP
        public async Task SendMessageToGroup(string groupName, string messageText)
        {
            string myUsername = Context.User.Identity.Name; // sender username
            var sender = await this.userManager.FindByNameAsync(myUsername);
            var room = this.roomService.GetByName(groupName);
            // store in DB
            var message = await this.messageService.CreateAsync(messageText, sender, null, room);
            // push to clients
            if (myUsername != null)
            {
                var messageModel = GetMessageModel(message);
                await Clients.Caller.SendAsync(pushMessage, messageModel);
                await Clients.OthersInGroup(groupName).SendAsync(pushMessage, messageModel);
            }
        }

        // SEND PRIVATE MESSAGE
        public async Task SendPrivateMessage(string recipientUsername, string messageText)
        {
            string myUsername = Context.User.Identity.Name; // sender username
            var sender = await this.userManager.FindByNameAsync(myUsername);
            //var recipient = await this.userManager.FindByNameAsync(recipientUsername);
            var recipient = this.userService.ByUsername(recipientUsername);
            // store in DB
            var message = await this.messageService.CreateAsync(messageText, sender, recipient);
            // push to clients
            if (myUsername != null && connectionIds.ContainsKey(recipientUsername))
            {
                var messageModel = GetMessageModel(message);
                await Clients.Caller.SendAsync(pushMessage, messageModel);
                await Clients.Client(connectionIds[recipientUsername]).SendAsync(pushMessage, messageModel);
            }
        }



        // get user model
        private static UserModel GetUserModel(User u) =>
            new UserModel
            {
                Id = u.Id,
                Username = u.UserName,
                IsOnline = usersOnline.ContainsKey(u.UserName),
                OnlineAtUTC = timesUTC.GetValueOrDefault(u.UserName)
            };

        // get message model
        private static MessageModel GetMessageModel(Message m) =>
            new MessageModel
            {
                Id = m.Id,
                Text = m.Text,
                TimeSent = m.TimeSent,
                Sender = GetUserModel(m.Sender)
            };
    }
}

