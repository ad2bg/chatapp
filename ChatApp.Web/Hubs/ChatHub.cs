namespace ChatApp.Web.Hubs
{
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class ChatHub : Hub
    {
        const string you = "You";

        // Client-side methods
        const string userOnline = "userOnline";
        const string userOffline = "userOffline";
        const string receiveMessage = "receiveMessage";


        private static Dictionary<string, string> users = new Dictionary<string, string>();


        // ADD TO USERS
        private void AddToUsers(string username)
        {
            users[username] = Context.ConnectionId;
        }

        // REMOVE FROM USERS
        private void RemoveFromUsers(string username)
        {
            users.Remove(username);
        }

        // ONLINE
        public override Task OnConnectedAsync()
        {

            string username = Context.User.Identity.Name;
            if (username != null)
            {
                AddToUsers(username);
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
                RemoveFromUsers(username);
                Clients.All.SendAsync(userOffline, username);
            }
            return base.OnDisconnectedAsync(exception);
        }


        // SEND PUBLIC MESSAGE
        public async Task SendPublicMessage(string message)
        {
            string username = Context.User.Identity.Name;
            if (username != null)
            {
                await Clients.Caller.SendAsync(receiveMessage, you, message);
                await Clients.Others.SendAsync(receiveMessage, username, message);
            }
        }

        // SEND MESSAGE TO GROUP
        public async Task SendMessageToGroup(string groupName, string message)
        {
            string username = Context.User.Identity.Name;
            if (username != null)
            {
                await Clients.Caller.SendAsync(receiveMessage, you, message);
                await Clients.OthersInGroup(groupName).SendAsync(receiveMessage, username, message);
            }
        }

        // SEND PRIVATE MESSAGE
        public async Task SendPrivateMessage(string user, string message)
        {
            string username = Context.User.Identity.Name; // sender
            if (username != null && users.ContainsKey(user))
            {
                await Clients.Client(users[user]).SendAsync(receiveMessage, username, message);
            }
        }


        // JOIN ROOM
        public async Task JoinRoom(string groupName)
        {
            string connectionId = Context.ConnectionId;
            string username = Context.User.Identity.Name;
            await Groups.AddToGroupAsync(connectionId, groupName);
            await Clients.Group(groupName).SendAsync(receiveMessage, username, $"{username} has joined the group {groupName}.");
        }

        // LEAVE ROOM
        public async Task LeaveRoom(string groupName)
        {
            string connectionId = Context.ConnectionId;
            string username = Context.User.Identity.Name;
            await Groups.RemoveFromGroupAsync(connectionId, groupName);
            await Clients.Group(groupName).SendAsync(receiveMessage, username, $"{username} has left the group {groupName}.");
        }
    }
}
