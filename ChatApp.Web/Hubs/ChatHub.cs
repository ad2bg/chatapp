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
        const string pushTyping = "pushTyping";

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
            IMessageService messageService)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.roomService = roomService;
            this.messageService = messageService;
        }



        // CONNECTED ASYNC
        /// <summary>
        /// This method is run when a connection with a client is established.
        /// </summary>
        /// <returns></returns>
        public override async Task OnConnectedAsync()
        {
            try
            {
                DateTime? now = DateTime.UtcNow; // UTC!

                // get user
                string myUsername = Context.User.Identity.Name;
                var user = await this.userService.ByUsernameAsync(myUsername);
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
                        foreach (var roomName in roomNames)
                        {
                            try
                            {
                                await this.JoinRoomAsync(roomName);
                            }
                            catch (Exception)
                            {
                                Console.WriteLine($"Error connecting {myUsername} to group {roomName}.");
                            }
                        }
                    }


                    // push to clients  (in user's groups)
                    var userModel = GetUserModel(user);
                    foreach (var roomName in user.RoomMembers.Select(rm => rm.Room.Name))
                    {
                        await Clients.Group(roomName).SendAsync(userOnline, userModel);
                    }
                    //Clients.All.SendAsync(userOnline, userModel);  //  notify ALL users

                    Console.WriteLine($"ONLINE - {connectionId} - {myUsername}");
                }
            }
            catch (Exception e)
            {
                await LogError(e);
            }
            await base.OnConnectedAsync();
        }

        // DISCONNECTED ASYNC
        /// <summary>
        /// This is run when a connection with a client is lost.
        /// The method does not immediately mark the user as offline,
        /// but rather schedules another method (GoOfflineAsync) to do that
        /// after a certain time (disconnectTolerance) elapses.
        /// This prevents the users going offline due to small interruptions in the connection.
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                string myUsername = Context.User.Identity.Name;
                var connectionId = Context.ConnectionId;
                disconnected[myUsername] = connectionId;

                if (myUsername != null)
                {
                    await Task.Delay(disconnectTolerance).ContinueWith(async (t) => await GoOfflineAsync(myUsername));
                }

                Console.WriteLine($"~~~~~~ - {connectionId} - {myUsername}");
            }
            catch (Exception e)
            {
                await LogError(e);
            }
            await base.OnDisconnectedAsync(exception);
        }

        // go offline async
        /// <summary>
        /// Marks a user as oflline a certain time (disconnectTolerance) after a connection is lost.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private async Task GoOfflineAsync(string username)
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
                await Clients.All.SendAsync(userOffline, username);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
            Console.WriteLine($"OFFLINE - {username}");
        }



        // GET DATA ASYNC
        /// <summary>
        /// Pushes the user's username and the list of rooms to the connected user.
        /// </summary>
        /// <returns></returns>
        public async Task GetDataAsync()
        {
            try
            {
                var connectionId = Context.ConnectionId;
                var myUsername = Context.User.Identity.Name;
                // send youAre
                await Clients.Caller.SendAsync(youAre, myUsername);
                // if no Public room exists -> create it
                if (!this.roomService.Exists(WebConstants.PublicRoomName))
                {
                    await this.roomService.CreateAsync(WebConstants.PublicRoomName, null);
                }
                // push rooms
                var rooms = await this.roomService.AllAsync(myUsername);
                await Clients.Caller.SendAsync(pushRooms, rooms);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }



        // CREATE ROOM ASYNC
        /// <summary>
        /// Creates a new chat room.
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task CreateRoomAsync(string groupName)
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
                await LogError(e);
            }
        }


        // JOIN ROOM ASYNC
        /// <summary>
        /// The user joins a chat room.
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task JoinRoomAsync(string groupName)
        {
            try
            {
                var myUsername = Context.User.Identity.Name;
                var user = await this.userManager.FindByNameAsync(myUsername);
                // add the user as a room member in the DB
                await this.roomService.AddMemberAsync(groupName, user);
                // add the connection to the group
                var connectionId = Context.ConnectionId;
                await Groups.AddToGroupAsync(connectionId, groupName);
                // notify all room members
                var users = await this.roomService.GetMembersAsync(groupName);
                var userModels = users.Select(u => GetUserModel(u)).OrderBy(m => m.Username);
                await Clients.OthersInGroup(groupName).SendAsync(pushUsers, userModels);
                // getData
                await Clients.Caller.SendAsync(getData);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // LEAVE ROOM ASYNC
        /// <summary>
        /// The user leaves a chat room.
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task LeaveRoomAsync(string groupName)
        {
            try
            {
                var myUsername = Context.User.Identity.Name;
                var user = await this.userManager.FindByNameAsync(myUsername);
                // remove the user as a room member in the DB
                await this.roomService.RemoveMemberAsync(groupName, user);
                // remove the connection from the group
                var connectionId = Context.ConnectionId;
                await Groups.RemoveFromGroupAsync(connectionId, groupName);
                // notify all room members
                var users = await this.roomService.GetMembersAsync(groupName);
                var userModels = users.Select(u => GetUserModel(u));
                await Clients.Group(groupName).SendAsync(pushUsers, userModels);
                // getData
                await Clients.Caller.SendAsync(getData);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }


        // PUSH ALL USERS ASYNC
        /// <summary>
        /// Pushes to the connected client a list of ALL users
        /// </summary>
        /// <returns></returns>
        public async Task PushAllUsersAsync()
        {
            try
            {
                var myUsername = Context.User.Identity.Name; // caller username
                var users = await this.userService.AllAsync();
                var userModels = users.Select(u => GetUserModel(u));
                await Clients.Caller.SendAsync(pushUsers, userModels);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // PUSH ROOM MEMBERS ASYNC
        /// <summary>
        /// Pushes to the connected client a list of the members of a given room
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task PushRoomMembersAsync(string groupName)
        {
            try
            {
                var myUsername = Context.User.Identity.Name; // caller username
                var users = await this.roomService.GetMembersAsync(groupName);
                var userModels = users.Select(u => GetUserModel(u));
                await Clients.Caller.SendAsync(pushUsers, userModels);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // PUSH ROOM MESSAGES ASYNC
        /// <summary>
        /// Pushes to the connected client a list of the messages in a given room
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task PushRoomMessagesAsync(string groupName)
        {
            try
            {
                var messages = await this.messageService.AllInRoomAsync(groupName);
                var messageModels = messages.Select(m => GetMessageModel(m));
                await Clients.Caller.SendAsync(pushMessages, messageModels);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // PUSH USER MESSAGES ASYNC
        /// <summary>
        /// Puches to the connected client a list of the messages between himself and another given user.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task PushUserMessagesAsync(string username)
        {
            try
            {
                string myUsername = Context.User.Identity.Name; // caller username
                var myself = await this.userManager.FindByNameAsync(myUsername);
                var partner = await this.userManager.FindByNameAsync(username);

                // show messages
                var messages = await this.messageService.AllWithUserAsync(myself.Id, partner.Id);
                await Clients.Caller.SendAsync(pushMessages, messages.Select(m => GetMessageModel(m)));
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }



        // SEND PUBLIC MESSAGE ASYNC
        /// <summary>
        /// Sends a public message.
        /// This method is added just for illustration.
        /// It is not actually used, because we have a public chat room where all users may join if they wish.
        /// </summary>
        /// <param name="messageText"></param>
        /// <returns></returns>
        public async Task SendPublicMessageAsync(string messageText)
        {
            try
            {
                var myUsername = Context.User.Identity.Name; // sender username
                var user = await this.userManager.FindByNameAsync(myUsername);
                // store in DB
                var message = await this.messageService.CreateAsync(messageText, user, null, null);
                // push to clients
                if (myUsername == null) { return; }
                var messageModel = GetMessageModel(message);
                await Clients.All.SendAsync(pushMessage, messageModel);
            }
            catch (Exception e)
            {
                await LogError(e);
            }

        }

        // SEND MESSAGE TO GROUP ASYNC
        /// <summary>
        /// Sends a message to a given chat room.
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="messageText"></param>
        /// <returns></returns>
        public async Task SendMessageToGroupAsync(string groupName, string messageText)
        {
            try
            {
                string myUsername = Context.User.Identity.Name; // sender username
                var sender = await this.userManager.FindByNameAsync(myUsername);
                var room = await this.roomService.GetByNameAsync(groupName);
                // store in DB
                var message = await this.messageService.CreateAsync(messageText, sender, null, room);
                // push to clients
                if (myUsername == null) { return; }
                var messageModel = GetMessageModel(message);
                await Clients.Caller.SendAsync(pushMessage, messageModel);
                await Clients.OthersInGroup(groupName).SendAsync(pushMessage, messageModel);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // SEND PRIVATE MESSAGE ASYNC
        /// <summary>
        /// Sends a private message to another user.
        /// </summary>
        /// <param name="recipientUsername"></param>
        /// <param name="messageText"></param>
        /// <returns></returns>
        public async Task SendPrivateMessageAsync(string recipientUsername, string messageText)
        {
            try
            {
                string myUsername = Context.User.Identity.Name; // sender username
                var sender = await this.userManager.FindByNameAsync(myUsername);
                //var recipient = await this.userManager.FindByNameAsync(recipientUsername);
                var recipient = await this.userService.ByUsernameAsync(recipientUsername);
                // store in DB
                var message = await this.messageService.CreateAsync(messageText, sender, recipient);
                // push to clients
                if (myUsername == null) { return; }
                var messageModel = GetMessageModel(message);
                await Clients.Caller.SendAsync(pushMessage, messageModel);
                if (!connectionIds.ContainsKey(recipientUsername)) { return; }
                await Clients.Client(connectionIds[recipientUsername]).SendAsync(pushMessage, messageModel);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }



        // TYPING PUBLIC ASYNC
        /// <summary>
        /// Notifies all users that someone is typing 
        /// This method is added just for illustration.
        /// It is not actually used, because we have a public chat room where all users may join if they wish.
        /// </summary>
        /// <param name="typingText"></param>
        /// <returns></returns>
        public async Task TypingPublicAsync(string typingText)
        {
            try
            {
                await Clients.All.SendAsync(pushTyping, typingText);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // TYPING IN ROOM ASYNC
        /// <summary>
        /// Notifies users in a room that someone is typing 
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="typingText"></param>
        /// <returns></returns>
        public async Task TypingInRoomAsync(string groupName, string typingText)
        {
            try
            {
                string myUsername = Context.User.Identity.Name; // sender username
                var sender = await this.userManager.FindByNameAsync(myUsername);
                Console.WriteLine($"{myUsername} -> {groupName} -> {typingText}");
                await Clients.OthersInGroup(groupName).SendAsync(pushTyping, typingText);
            }
            catch (Exception e)
            {
                await LogError(e);
            }
        }

        // TYPING PRIVATE ASYNC
        /// <summary>
        /// Notifies the other user in a private chat that you are typing 
        /// </summary>
        /// <param name="recipientUsername"></param>
        /// <param name="typingText"></param>
        /// <returns></returns>
        public async Task TypingPrivateAsync(string recipientUsername, string typingText)
        {
            try
            {
                if (!connectionIds.ContainsKey(recipientUsername)) { return; }
                await Clients.Client(connectionIds[recipientUsername]).SendAsync(pushTyping, typingText);
            }
            catch (Exception e)
            {
                await LogError(e);
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

        // log error
        private async Task LogError(Exception e)
        {
            try
            {
                Console.WriteLine($"ERROR on server: {e.Message}");
                await Clients.Caller.SendAsync(notify, e.Message);
            }
            catch (Exception)
            {
            }

        }
    }
}

