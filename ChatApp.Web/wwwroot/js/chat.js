'use strict';

// server-side methods
const sendPublicMessage = 'SendPublicMessage';
const sendMessageToGroup = 'SendMessageToGroup';
const sendPrivateMessage = 'SendPrivateMessage';
const hubJoinRoom = 'JoinRoom';
const hubLeaveRoom = 'LeaveRoom';

// client-side methods
const userOnline = "userOnline";
const userOffline = "userOffline";
const receiveMessage = "receiveMessage";


// UI elements
const messageInput = $('#messageInput');
const toRoomInput = $('#toRoomInput');
const toUserInput = $('#toUserInput');
const roomInput = $('#roomInput');
const messagesList = $('#messagesList');
const usersList = messagesList;


// set connection
// LogLevel: Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chatHub')
    .configureLogging(signalR.LogLevel.Information)
    .build();

// start the connection (and restart it as necessary)
connection
    .start()
    .catch(err => console.error(err.toString()));

connection.onclose(async () => { await start(); });

async function start() {
    const now = new Date();

    try {
        await connection.start();
        console.log('connected ' + now.toUTCString);
    } catch (err) {
        console.log(`${now.toUTCString}\n${err}`);
        setTimeout(() => start(), 5000);
    }
}



// user online
connection.on(userOnline, username => {
    const li = $('<li>');
    const now = new Date();
    li.text(username + ' joined at ' + now.toLocaleTimeString());
    usersList.append(li);
});

// user offline
connection.on(userOffline, username => {
    const li = $('<li>');
    const now = new Date();
    li.text(username + ' left at ' + now.toLocaleTimeString());
    usersList.append(li);
});



// SEND MESSAGE
function sendMessage() {
    const message = messageInput.val();
    const toRoomName = toRoomInput.val().trim();
    const toUserName = toUserInput.val().trim();
    messageInput.val('');
    toRoomInput.val('');
    toUserInput.val('');


    if (toUserName) {
        // to user
        connection
            .invoke(sendPrivateMessage, toUserName, message)
            .catch(err => console.error(err.toString()));
    }
    else if (toRoomName) {
        // to room
        connection
            .invoke(sendMessageToGroup, toRoomName, message)
            .catch(err => console.error(err.toString()));
    }
    else {
        // public
        console.log(message);
        connection
            .invoke(sendPublicMessage, message)
            .catch(err => console.error(err.toString()));
    }
}

// RECEIVE MESSAGE
connection.on(receiveMessage, (user, message) => {
    const li = $('<li>');
    li.text(`${user}: ${escapeHtml(message)}`);
    messagesList.append(li);
});

function escapeHtml(unsafeText) {
    //return unsafeText;
    return unsafeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// JOIN ROOM
function joinRoom() {
    const roomName = roomInput.val().trim();
    connection
        .invoke(hubJoinRoom, roomName)
        .catch(err => console.error(err.toString()));
}

// LEAVE ROOM
function leaveRoom() {
    const roomName = roomInput.val().trim();
    connection
        .invoke(hubLeaveRoom, roomName)
        .catch(err => console.error(err.toString()));
}
