﻿//import LikeButton from './components/LikeButton'

const chatApp = (() => {
    return {
        // connection
        connectionUrl: '/chatHub',

        // server-side methods
        hubGetData: 'GetDataAsync',
        hubCreateRoom: 'CreateRoomAsync',
        hubJoinRoom: 'JoinRoomAsync',
        hubLeaveRoom: 'LeaveRoomAsync',
        hubPushAllUsers: 'PushAllUsersAsync',
        hubPushRoomMembers: 'PushRoomMembersAsync',
        hubPushRoomMessages: 'PushRoomMessagesAsync',
        hubPushUserMessages: 'PushUserMessagesAsync',
        sendPublicMessage: 'SendPublicMessageAsync',
        sendMessageToGroup: 'SendMessageToGroupAsync',
        sendPrivateMessage: 'SendPrivateMessageAsync',
        hubTypingPublic: 'TypingPublicAsync',
        hubTypingInRoom: 'TypingInRoomAsync',
        hubTypingPrivate: 'TypingPrivateAsync',

        // client-side methods
        getData: "getData",
        youAre: "youAre",
        notify: "notify",
        userOnline: "userOnline",
        userOffline: "userOffline",
        pushRooms: "pushRooms",
        pushUsers: "pushUsers",
        pushMessages: "pushMessages",
        pushMessage: "pushMessage",
        pushTyping: "pushTyping",

        // other constants
        publicRoomName: 'Public',
        formatTimeShort: 'HH:NN',
        formatTimeLong: 'DD/MM/YYYY HH:NN:SS',
        formatDate: (dateObj, format = 'yyyy/mm/dd') => {

            //console.log(dateObj);

            if (!dateObj || 'now' === dateObj) dateObj = new Date();

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            function pad(n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }

            //const time = dateObj.getTime();
            const year = dateObj.getFullYear(); // yyyy / yy
            const month = 1 + dateObj.getMonth(); // mm / m
            let day = dateObj.getDay(); // wwww / www / ww
            const date = dateObj.getDate(); // dd / d
            const hours = dateObj.getHours(); // hh / h
            const minutes = dateObj.getMinutes(); // nn /n
            const seconds = dateObj.getSeconds(); // ss
            const milliseconds = dateObj.getMilliseconds(); // lll
            day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];

            format = format.toLowerCase();
            format = format.replace('yyyy', year);
            format = format.replace('yy', year % 100);
            format = format.replace('mmmm', months[month - 1]);
            format = format.replace('mmm', months[month - 1].substr(0, 3));
            format = format.replace('mm', pad(month, 2));
            format = format.replace('m', month);
            format = format.replace('wwww', day);
            format = format.replace('www', day.substring(0, 3));
            format = format.replace('ww', day.substring(0, 2));
            format = format.replace('dd', pad(date, 2));
            format = format.replace('d', date);
            format = format.replace('hh', pad(hours, 2));
            format = format.replace('h', hours);
            format = format.replace('nn', pad(minutes, 2));
            format = format.replace('n', minutes);
            format = format.replace('ss', pad(seconds, 2));
            format = format.replace('s', seconds);
            format = format.replace('lll', pad(milliseconds, 3));
            return format;
        },
        userUsernamePropertyName: 'username',
        roomModelNamePropertyName: 'name',
        typingCheckFrequency: 2000,
        typingCheckThreshold: 3,
    }
})();


// APP
class App extends React.Component {

    connection;

    state = {
        youAre: null, activePage: null,
        rooms: [], users: [], messages: [],
        activeRoom: null, lastActiveRoom: null,
        activeUser: null, lastActiveUser: null,
        typingText: null,
    }

    componentDidMount() {

        const { connectionUrl, getData, youAre, notify, userOnline, userOffline,
            pushRooms, pushUsers, pushMessages, pushMessage, pushTyping } = chatApp;

        // set connection
        // LogLevel: Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
        this.connection = new signalR.HubConnectionBuilder().withUrl(connectionUrl)
            .configureLogging(signalR.LogLevel.Information).build()

        // start the connection (and restart it as necessary)
        const startConnection = async () => await this.connection.start()
            .then(() => {
                let now = new Date();
                now = now.toUTCString();
                console.log('OK! Connection started ' + now);
                this.getData();
                this.setPage('Rooms');
            })
            .catch(err => console.error(err.toString()));
        startConnection();
        this.connection.onclose(async () => {
            let now = new Date();
            now = now.toUTCString();
            console.log('??? Connection closed ' + now);
            await restart();
        });
        const restart = async () => {
            let now = new Date();
            now = now.toUTCString();
            try {
                await startConnection();
            } catch (err) {
                console.log(`${now}\n${err}`);
                setTimeout(() => restart(), 3000);
            }
        }

        this.connection.on(getData, () => this.getData());
        this.connection.on(youAre, username => this.youAre(username));
        this.connection.on(notify, message => this.notify(message));
        this.connection.on(userOnline, username => this.userOnline(username));
        this.connection.on(userOffline, username => this.userOffline(username));
        this.connection.on(pushRooms, rooms => this.pushRooms(rooms));
        this.connection.on(pushUsers, users => this.pushUsers(users));
        this.connection.on(pushMessages, messages => this.pushMessages(messages));
        this.connection.on(pushMessage, (user, messageText) => this.pushMessage(user, messageText));
        this.connection.on(pushTyping, (typingText) => this.pushTyping(typingText));
    }

    // SET PAGE
    setPage = (page, room = null, user = null) => {

        const { publicRoomName } = chatApp;
        const { rooms, activePage, activeRoom, lastActiveRoom, activeUser, lastActiveUser } = this.state;

        console.log(`${activePage} -> ${page}`);

        switch (page) {
            case 'Rooms':
                this.getData();

                if (activeRoom) {
                    this.setState({
                        activePage: page,
                        lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                    }); // keep the activeRoom unchanged
                } else {
                    if (lastActiveRoom) {
                        this.setState({
                            activePage: page,
                            activeRoom: lastActiveRoom,
                            lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                        }); // back to lastActiveRoom
                    } else {
                        let thePublicRoom = rooms.find(r => r.name == publicRoomName);
                        if (!thePublicRoom) { thePublicRoom = { name: publicRoomName }; }
                        this.setState({
                            activePage: page,
                            activeRoom: thePublicRoom,
                            lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                        }); // activate Public room
                    }
                }
                break;

            case 'Users':
                this.connection.invoke(chatApp.hubPushRoomMembers, room.name).catch(err => console.error(err.toString()));
                this.setState({
                    activePage: page,
                    activeRoom: room,
                    lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                    activeUser: null,
                    lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                });
                break;

            case 'AllUsers':
                this.connection.invoke(chatApp.hubPushAllUsers).catch(err => console.error(err.toString()));
                this.setState({
                    activePage: 'Users',
                    activeRoom: null,
                    lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                    activeUser: null,
                    lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                });
                break;

            case 'Chat':

                if (user) {

                    //console.log(user.username);

                    this.setState({
                        activePage: page,
                        activeRoom: null,
                        lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                        activeUser: user,
                        lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                    });
                    this.connection.invoke(chatApp.hubPushUserMessages, user.username).catch(err => console.error(err.toString()));
                } else if (room) {

                    //console.log(room.name);

                    this.setState({
                        activePage: page,
                        activeRoom: room,
                        lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                        activeUser: null,
                        lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                    });
                    this.connection.invoke(chatApp.hubPushRoomMessages, room.name).catch(err => console.error(err.toString()));
                } else {
                    let thePublicRoom = rooms.find(r => r.name == publicRoomName);
                    if (!thePublicRoom) { thePublicRoom = { name: publicRoomName }; }
                    this.setState({ activePage: page, activeRoom: thePublicRoom });
                    this.connection.invoke(chatApp.hubPushRoomMessages, publicRoomName).catch(err => console.error(err.toString()));
                }

                break;

            default: throw new DOMException(`No page ${page}`); break;
        }
    }


    // GET DATA
    getData = () => this.connection.invoke(chatApp.hubGetData).catch(err => console.error(err.toString()));

    // YOU ARE
    youAre = (username) => this.setState({ youAre: username });

    // NOTIFY
    notify = (message) => { alert(message); };



    /////////////


    // PUSH ROOMS
    pushRooms = (roomModels) => {
        console.log('Rooms:' + roomModels.length);
        //console.log(rooms);

        // move the Public room to the top
        const { publicRoomName, roomModelNamePropertyName } = chatApp;
        const publicRoom = roomModels.find(r => r.name === publicRoomName);
        roomModels = this.sortByProperty(roomModelNamePropertyName, roomModels.filter(r => r.name !== publicRoomName));
        // setState
        this.setState({ rooms: [publicRoom, ...roomModels] });
    }

    // CREATE ROOM
    createRoom = (roomName) => this.connection.invoke(chatApp.hubCreateRoom, roomName).catch(err => console.error(err.toString()));

    // JOIN ROOM
    joinRoom = (roomName) => this.connection.invoke(chatApp.hubJoinRoom, roomName).catch(err => console.error(err.toString()));

    // LEAVE ROOM
    leaveRoom = (roomName) => this.connection.invoke(chatApp.hubLeaveRoom, roomName).catch(err => console.error(err.toString()));


    /////////////


    // PUSH USERS
    pushUsers = (userModels) => {
        const { userUsernamePropertyName } = chatApp;
        console.log('Users:' + userModels.length);
        //console.log(userModels);
        this.setState({ users: this.sortByProperty(userUsernamePropertyName, userModels) });
    }

    // USER ONLINE
    userOnline = (userModel) => {
        const { userUsernamePropertyName } = chatApp;
        //console.log(userModel);
        this.userOffline(userModel.username);
        const userModels = this.sortByProperty(userUsernamePropertyName, [...this.state.users, userModel]);
        this.setState({ users: userModels });
    }

    // USER OFFLINE
    userOffline = (username) => {
        const { userUsernamePropertyName } = chatApp;
        this.setState({ users: this.sortByProperty(userUsernamePropertyName, this.state.users.filter(user => user.username !== username)) });
    }


    /////////////


    // PUSH MESSAGES
    pushMessages = (messageModels) => this.setState({ messages: messageModels });

    // PUSH MESSAGE
    pushMessage = (messageModel) => {
        console.log(messageModel);
        const messageText = this.escapeHtml(messageModel.text);
        this.setState({
            messages: [...this.state.messages, {
                id: messageModel.id,
                text: messageText,
                timeSent: messageModel.timeSent,
                sender: messageModel.sender,
            }]
        })
    }

    escapeHtml = (unsafeText) => {
        return unsafeText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // PUSH TYPING
    pushTyping = (typingText) => this.setState({ typingText: typingText });


    // SEND MESSAGE
    sendMessage = (messageText) => {

        const { sendPublicMessage, sendMessageToGroup, sendPrivateMessage } = chatApp;
        const { activeRoom, activeUser } = this.state;

        if (activeUser) { // private message to another user
            console.log(`sending to user: ${activeUser.username} - ${messageText}`);
            this.connection.invoke(sendPrivateMessage, activeUser.username, messageText).catch(err => console.error(err.toString()));
        }
        else if (activeRoom) { // message to a given room
            console.log(`sending to room: ${activeRoom.name} - ${messageText}`);
            this.connection.invoke(sendMessageToGroup, activeRoom.name, messageText).catch(err => console.error(err.toString()));
        }
        else {
            // public;
            // Note: This should never be executed with the current implementation,
            // since we have the "Public" room. The Public room does not have an owner and can be joined by any user.
            // The idea behind the fact that the users can leave the Public room, is that they may want to avoid "spam".
            // On the server there is a corresponding "SendPublicMessage" method, just to illustrate how
            // messages would be forwarded to the other users in case we didn't have a Public room.
            console.log('sending publc: ' + messageText);
            this.connection.invoke(sendPublicMessage, messageText).catch(err => console.error(err.toString()));
        }

        this.refs.messages
            .refs.messagesFooter
            .refs.sendMessage
            .refs.messageInput.focus();
    }

    // SEND TYPING
    sendTyping = (isTyping) => {
        const { hubTypingPrivate, hubTypingInRoom, hubTypingPublic } = chatApp;
        const { youAre, activeRoom, activeUser } = this.state;

        if (activeUser) { // while private messaging with another user
            const typingText = isTyping ? `${youAre} is typing a message...` : '';
            this.connection.invoke(hubTypingPrivate, activeUser.username, typingText).catch(err => console.error(err.toString()));
        }
        else if (activeRoom) { // while messaging in a room or in public
            const typingText = isTyping ? 'Someone is typing a message...' : '';
            this.connection.invoke(hubTypingInRoom, activeRoom.name, typingText).catch(err => console.error(err.toString()));
        } else {
            const typingText = isTyping ? 'Someone is typing a message...' : '';
            this.connection.invoke(hubTypingPublic, typingText).catch(err => console.error(err.toString()));
        }
    }


    /////////////

    sortByProperty = (property, collection) => collection.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));


    // RENDER
    render() {
        const { youAre, rooms, users, messages, activeRoom, lastActiveRoom, activeUser, lastActiveUser, activePage, typingText } = this.state;
        return (
            <div className="row bg-light rounded border shadow h-100">

                {(activePage == 'Rooms') &&
                    <Rooms
                        rooms={rooms}
                        activeRoom={activeRoom}
                        createRoom={this.createRoom}
                        onJoin={this.joinRoom}
                        onLeave={this.leaveRoom}
                        setPage={this.setPage}
                    />}

                {(activePage == 'Users') &&
                    <Users
                        users={users.filter(u => u.username !== youAre)}
                        activeRoom={activeRoom}
                        setPage={this.setPage}
                    />}

                {(activePage == 'Chat') &&
                    <Messages
                        ref="messages"
                        messages={messages}
                        typingText={typingText}
                        youAre={youAre}
                        activeRoom={activeRoom}
                        activeRoom={activeRoom}
                        activeUser={activeUser}
                        lastActiveRoom={lastActiveRoom}
                        lastActiveUser={lastActiveUser}
                        sendMessage={this.sendMessage}
                        sendTyping={this.sendTyping}
                        setPage={this.setPage}
                    />}


            </div>
        );
    }
}



/////////////////
//    ROOMS    //
/////////////////

// ROOMS
class Rooms extends React.Component {
    render() {
        const { rooms, activeRoom, activeUser, createRoom, onJoin, onLeave, setPage } = this.props;
        return (
            <div className="col h-100 text-center bg-warning border p-0">

                <div className="bg-dark text-center border-bottom p-2 my-0">
                    <span data-tip="All Users"><ReactTooltip />
                        <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('AllUsers')}><ArrowsLeft /> All <IconAllUsers /></button>
                    </span>

                    <span data-tip="Total Rooms"><ReactTooltip />
                        <button className="btn btn-sm btn-primary" disabled><IconRooms /> : {rooms.length}</button>
                    </span>

                    <span data-tip={activeRoom ? 'Room' : 'User'}><ReactTooltip />
                        <button className="btn btn-sm btn-primary float-right" onClick={() => activeRoom ? setPage('Chat', activeRoom, null) : setPage('Chat', null, activeUser)}>
                            {activeRoom ? <span> <IconRoom /> {activeRoom.name} {SetIconPublic(activeRoom.name)}</span> : <span> <IconUser /> : {activeUser.username}  </span>} <ArrowsRight />
                        </button>
                    </span>
                </div>

                <RoomsList rooms={rooms} activeRoom={activeRoom} onJoin={onJoin} onLeave={onLeave} setPage={setPage} />
                <CreateRoom createRoom={createRoom} />
            </div >
        )
    }
}

// ROOMS LIST
class RoomsList extends React.Component {
    render() {
        const { rooms, activeRoom, onJoin, onLeave, setPage } = this.props;
        return (
            <div id="roomsList" className="p-2">
                {rooms.map((room, ix) => <RoomItem key={ix} room={room} activeRoom={activeRoom} onJoin={onJoin} onLeave={onLeave} setPage={setPage} />)}
            </div>
        )
    }
}

// ROOM ITEM
class RoomItem extends React.Component {

    onJoin = (e) => {
        e.preventDefault();
        this.props.onJoin(this.props.room.name);
    }
    onLeave = (e) => {
        e.preventDefault();
        this.props.onLeave(this.props.room.name);
    }

    render() {
        const { room, activeRoom, setPage } = this.props;
        const { name, membersCount, isMember } = room;
        return (
            <div className="bg-secondary d-flex p-1 my-2 rounded border shadow">

                { /* Room button */}
                <span data-tip data-for={'room-button-' + room.id}>
                    <button className={`btn btn-sm btn-${(activeRoom && name === activeRoom.name) ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                        disabled={!isMember} onClick={() => setPage('Chat', room, null)}> <IconRoom /> {name} {SetIconPublic(name)}</button>
                    <ReactTooltip id={'room-button-' + room.id}>
                        {(activeRoom && activeRoom.name === name) ? 'This is your current room.' : (isMember ? 'Chat!' : 'You need to join the room.')}
                    </ReactTooltip>
                </span>

                { /* Members button */}
                <span data-tip data-for={'members-button-' + room.id}>
                    <button className={`btn btn-sm btn-${(activeRoom && name === activeRoom.name) ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                        disabled={!isMember} onClick={() => setPage('Users', room, null)} ><IconUsers />: {membersCount} </button>
                    <ReactTooltip id={'members-button-' + room.id}>
                        {isMember ? 'See Room Members' : 'You need to join the room.'}
                    </ReactTooltip>
                </span>

                { /* Join / Leave button */}
                <div className="ml-auto">
                    {!isMember && <JoinLeaveButton isMember={false} room={room} onClick={this.onJoin} />}
                    {isMember && <JoinLeaveButton isMember={true} room={room} onClick={this.onLeave} />}
                </div>

            </div >
        )
    }
}

// JOIN/LEAVE BUTTON
class JoinLeaveButton extends React.Component {
    render() {
        const { isMember, room, onClick } = this.props;
        const { id, name } = room;
        return (
            <form data-tip data-for={'join-leave-' + id}>
                <input type="hidden" name="roomName" value={name} />
                <button className={`btn btn-sm btn-outline-${!isMember ? 'success' : 'danger'} mx-1 px-2 rounded`} onClick={onClick}>
                    <i className={`fas fa-sign-${!isMember ? 'in' : 'out'}-alt`}></i>
                </button>
                <ReactTooltip id={'join-leave-' + id}>{!isMember ? 'Join' : 'Leave'}</ReactTooltip>
            </form>
        )
    }
}

// CREATE ROOM
class CreateRoom extends React.Component {

    state = { roomName: '' }

    onSubmit = (e) => {
        e.preventDefault();
        const roomName = this.state.roomName.trim();
        if (roomName) {
            this.props.createRoom(roomName);
            this.setState({ roomName: '' });
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });


    render() {
        const { roomName } = this.state;
        return (
            <form onSubmit={this.onSubmit}
                className="w-100 bg-dark border-top d-flex py-2">

                <input type="text"
                    name="roomName"
                    className="form-control mx-1"
                    placeholder="Create Room..."
                    autoFocus={true}
                    value={roomName}
                    onChange={this.onChange}
                />

                <button type="submit" className="btn btn-primary mx-1" data-tip="Create Room"><IconAdd /></button>
                <ReactTooltip />
            </form>
        )
    }
}



/////////////////
//    USERS    //
/////////////////

// USERS
class Users extends React.Component {

    render() {
        const { users, activeRoom, lastActiveRoom, setPage } = this.props;
        return (
            <div className="col h-100 bg-secondary border p-0">
                <div className=" bg-dark text-center border-bottom p-2 my-0">

                    <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Rooms', activeRoom ? activeRoom : lastActiveRoom)} data-tip="All Rooms"><ArrowsLeft /> <IconRooms /> <ReactTooltip /> </button>

                    <span data-tip={activeRoom ? `Members of room ${activeRoom.name}` : "All Users"}> <ReactTooltip />
                        <button className="btn btn-sm btn-primary" disabled>
                            {activeRoom ? <span><IconUsers /> in <IconRoom /> {activeRoom.name} {SetIconPublic(activeRoom.name)}  </span> : <span><IconAllUsers /> All Users</span>}: {users.length}</button>
                    </span>

                    <button className="btn btn-sm btn-primary float-right" onClick={() => setPage('Chat', activeRoom ? activeRoom : lastActiveRoom)} data-tip="Chat"><IconMessages /> <ArrowsRight /> <ReactTooltip /> </button>

                </div>

                <UsersList users={users} setPage={setPage} />
            </div>
        )
    }
}

// USERS LIST
class UsersList extends React.Component {
    render() {
        const { users, setPage } = this.props;
        return (
            <div id="usersList" className="p-2">
                {(users.length > 0) && users.map((user, ix) => <UserItem key={ix} user={user} setPage={setPage} />)}
                {(users.length == 0) && <div className="text-center bg-warning p-3 m-5 rounded shadow display-4">No Users Here</div>}
            </div>
        )
    }
}

// USER ITEM
class UserItem extends React.Component {
    render() {
        const { formatDate, formatTimeShort } = chatApp;
        const { user, setPage, } = this.props;
        const { username, isOnline, onlineAtUTC } = user;
        return (
            <div className="my-1 d-flex">
                <button className={`btn btn-${isOnline ? 'success' : 'danger'} mx-2 px-2 rounded`} onClick={() => setPage('Chat', null, user)}><IconUser /> {username} </button>
                {isOnline && <div className="bg-warning mx-2 px-2 rounded ml-auto">Online: {formatDate(new Date(onlineAtUTC), formatTimeShort)}</div >}
            </div>
        )
    }
}



/////////////////
//  MESSAGES   //
/////////////////

// MESSAGES
class Messages extends React.Component {

    state = { filterTerm: '' };
    filterClear = (e) => {
        if (e) { e.preventDefault(); }
        this.setState({ filterTerm: '' });
    }
    filterChange = (e) => this.setState({ [e.target.name]: e.target.value });


    render() {
        const filter = { term: this.state.filterTerm, clear: this.filterClear, change: this.filterChange };
        const { youAre, messages, typingText, sendMessage, sendTyping, activeRoom, lastActiveRoom, activeUser, setPage } = this.props;
        const room = activeRoom ? activeRoom : lastActiveRoom;
        return (
            <div className="col h-100 bg-light border p-0">
                <div className="bg-dark text-center border-bottom p-2 my-0">

                    {/* << Rooms button */}
                    <span data-tip="All Rooms"><ReactTooltip />
                        {<button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Rooms', room)}><ArrowsLeft /> <IconRooms /></button>}
                    </span>

                    {/* Room / User */}
                    {activeRoom && <span data-tip="Room"><ReactTooltip /><button disabled className="btn btn-sm btn-primary"><IconRoom /> {room.name}</button></span>}
                    {activeUser && <span data-tip="User"><ReactTooltip /><button disabled className={`btn btn-sm btn-${activeUser.isOnline ? 'success' : 'danger'}`}><IconUser /> User: {activeUser.username}</button></span>}

                    {/* button Members >>  */}
                    <span data-tip="Room Members"><ReactTooltip />
                        <button className="btn btn-sm btn-primary float-right" onClick={() => setPage('Users', room)}> <IconUsers /> <ArrowsRight /></button></span>

                </div>

                <MessagesList messages={messages} filter={filter} youAre={youAre} typingText={typingText} />
                <MessagesFooter ref="messagesFooter" sendMessage={sendMessage} sendTyping={sendTyping} filter={filter} />
            </div>
        )
    }
}

// MESSAGES LIST
class MessagesList extends React.Component {
    render() {
        const { messages, filter, youAre, typingText } = this.props;
        const filteredMessages = messages.filter(m => m.text.toLowerCase().includes(filter.term.toLowerCase()));
        return (
            <div id="messagesList" className="p-2">
                {(filteredMessages.length > 0) &&
                    <div>
                        <div data-tip="Case Insensitive!"><ReactTooltip />
                            {filter.term && <div className="text-center bg-warning p-3 m-5 rounded shadow display-4">Messages containing <br /> '{filter.term}'</div>}
                        </div>
                        <div>{filteredMessages.map((msg, ix) => <MessageItem key={ix} msg={msg} youAre={youAre} />)}</div>
                    </div>}
                {(filteredMessages.length == 0)
                    && <div className="text-center bg-warning p-3 mx-3 my-5 rounded shadow display-4">No Messages {filter.term ? <span><br />containing '{filter.term}'</span> : ''}</div>}


                <div className="bg-info px-2 rounded "> {typingText}</div>
            </div>
        )
    }
}

// MESSAGE ITEM
class MessageItem extends React.Component {
    render() {
        //console.log(this.props.msg);
        const { formatDate, formatTimeLong } = chatApp;
        const { youAre, msg } = this.props;
        const { sender, text, timeSent } = msg;
        const isYou = (sender.username === youAre);
        const justify = 'd-flex justify-content-' + (isYou ? 'end' : 'start');
        return (
            <div>
                <div className={`my-1 ${justify}`}>
                    <div className="bg-primary mx-2 px-2 rounded"
                        style={{ order: (isYou ? 1 : -1) }}>{sender.username}</div>
                    <div className="bg-warning mx-2 px-2 rounded">{text}</div >
                </div>
                <div className={`mt-1 mb-4 ${justify}`}>
                    <div className="bg-secondary text-white mx-2 px-2 rounded">{formatDate(new Date(timeSent), formatTimeLong)}</div >
                </div>
            </div>
        )
    }
}

// MESSAGES FOOTER
class MessagesFooter extends React.Component {

    state = { showFilter: false }

    onToggle = () => {
        this.setState({ showFilter: !this.state.showFilter });
        if (this.state.showFilter) { this.props.filter.clear(); }
    }

    render() {
        const { showFilter } = this.state;
        const { sendMessage, sendTyping, filter } = this.props;
        return (
            <div className="w-100 bg-dark border-top d-flex py-2">
                <ToggleButton classes="btn btn btn-warning mx-1" onOff={showFilter} onClick={() => this.onToggle()} dataTip="Toggle Filter" />
                {!showFilter ? <SendMessage ref="sendMessage" sendMessage={sendMessage} sendTyping={sendTyping} /> : <FilterMessages filter={filter} />}
            </div>
        )
    }
}

// SEND MESSAGE
class SendMessage extends React.Component {

    state = {
        message: '',
        timerId: null,
        changeCount: 0,
    }

    onSubmit = (e) => {
        e.preventDefault();
        const message = this.state.message.trim();
        if (message) {
            this.props.sendMessage(message);
            this.setState({ message: '' });
        }
    }

    onChange = (e) => {
        const { typingCheckFrequency } = chatApp;
        const { timerId, changeCount } = this.state;
        this.setState({
            [e.target.name]: e.target.value,
            changeCount: changeCount + 1
        });
        if (!timerId) {
            this.setState({ timerId: setTimeout(this.check, typingCheckFrequency) });
        }
    }
    check = () => {
        const { typingCheckFrequency, typingCheckThreshold } = chatApp;
        const isTyping = (this.state.changeCount > typingCheckThreshold);

        this.props.sendTyping(isTyping);
        if (isTyping) {
            this.setState({ timerId: setTimeout(this.check, typingCheckFrequency) });
        }
        this.setState({ timerId: null });
        if (this.state.changeCount > 0) {
            this.setState({ timerId: setTimeout(this.check, typingCheckFrequency), changeCount: 0 });
        }
    }

    componentDidUpdate() {
        const objDiv = document.getElementById("messagesList");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    render() {
        const { message } = this.state;
        return (
            <form className="d-flex w-100" onSubmit={this.onSubmit}>

                <input type="text"
                    ref="messageInput"
                    name="message"
                    className="form-control mx-1"
                    placeholder="Send message..."
                    autoFocus={true}
                    value={message}
                    onChange={this.onChange}
                />

                <button type="submit" className="btn btn-primary mx-1" data-tip="Send"><IconSend /></button><ReactTooltip />
            </form>
        )
    }
}

// FILTER MESSAGES
class FilterMessages extends React.Component {

    componentDidUpdate() {
        const objDiv = document.getElementById("messagesList");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    render() {
        const { term, clear, change } = this.props.filter;
        return (
            <form className="d-flex w-100" onSubmit={clear}>

                <input type="text"
                    ref="filterTermInput"
                    name="filterTerm"
                    className="form-control mx-1"
                    placeholder="Filter messages..."
                    autoFocus={true}
                    value={term}
                    onChange={change}
                />

                <button type="submit" className="btn btn-sm btn-primary mx-1" data-tip="Filter"><IconClearFilter /></button> <ReactTooltip />

            </form>
        )
    }
}


const SetIconPublic = (roomName) => (roomName === chatApp.publicRoomName) && <IconPublic />;
const ArrowsLeft = () => <i className="fas fa-angle-double-left"></i>;
const ArrowsRight = () => <i className="fas fa-angle-double-right"></i>;
const IconRoom = () => <i className="fab fa-react"></i>;
const IconRooms = () => <span><IconRoom /><IconRoom /></span>;
const IconPublic = () => <i className="fas fa-globe-americas"></i>;
const IconAllUsers = () => <i className="fas fa-users"></i>;
const IconUser = () => <i className="far fa-user"></i>;
const IconUsers = () => <i className="fas fa-user-friends"></i>;
const IconMessages = () => <i className="far fa-comments"></i>;
const IconMessage = () => <i className="far fa-comment"></i>;
const IconAdd = () => <i className="fas fa-plus"></i>;
const IconSend = () => <i className="far fa-share-square"></i>;

const IconClearFilter = () => < span className="fa-stack" > <i className="fa fa-filter fa-stack-1x"></i> <i className="fa fa-ban fa-stack-2x text-danger"></i></span>;
const IconGithub = () => < i className="fab fa-github" ></i>;

const IconToggleOn = () => <i className="fas fa-toggle-on"></i>;
const IconToggleOff = () => <i className="fas fa-toggle-off"></i>;
const ToggleButton = (props) =>
    <span>
        <ReactTooltip />
        <button className={props.classes} onClick={props.onClick} data-tip={props.dataTip}>{props.onOff ? <IconToggleOn /> : <IconToggleOff />}</button>
    </span>;

const domContainer = document.querySelector('#root');
if (domContainer) { ReactDOM.render(<App />, domContainer); }
