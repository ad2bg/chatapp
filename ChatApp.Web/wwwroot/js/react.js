//import LikeButton from './components/LikeButton'


const chatApp = (() => {
    return {
        // connection
        connectionUrl: '/chatHub',

        // server-side methods
        hubGetData: 'GetData',
        hubCreateRoom: 'CreateRoom',
        hubJoinRoom: 'JoinRoom',
        hubLeaveRoom: 'LeaveRoom',
        sendPublicMessage: 'SendPublicMessage',
        sendMessageToGroup: 'SendMessageToGroup',
        sendPrivateMessage: 'SendPrivateMessage',
        hubPushAllUsers: 'PushAllUsers',
        hubPushRoomMembers: 'PushRoomMembers',
        hubPushRoomMessages: 'PushRoomMessages',
        hubPushUserMessages: 'PushUserMessages',

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
        userCircleSize: 50,
        userUsernamePropertyName: 'username',
        roomModelNamePropertyName: 'name',
    }
});



// APP
class App extends React.Component {

    connection;

    state = {
        youAre: null, activePage: null,
        rooms: [], users: [], messages: [],
        activeRoom: null, lastActiveRoom: null,
        activeUser: null, lastActiveUser: null,
    }

    componentDidMount() {

        const { connectionUrl, getData, youAre, notify, userOnline, userOffline,
            pushRooms, pushUsers, pushMessages, pushMessage } = chatApp();

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
    }

    // SET PAGE
    setPage = (page, room = null, user = null) => {

        const { publicRoomName } = chatApp();
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
                this.connection.invoke(chatApp().hubPushRoomMembers, room.name).catch(err => console.error(err.toString()));
                this.setState({
                    activePage: page,
                    activeRoom: room,
                    lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                    activeUser: null,
                    lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                });
                break;

            case 'AllUsers':
                this.connection.invoke(chatApp().hubPushAllUsers).catch(err => console.error(err.toString()));
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
                    this.connection.invoke(chatApp().hubPushUserMessages, user.username).catch(err => console.error(err.toString()));
                } else if (room) {

                    //console.log(room.name);

                    this.setState({
                        activePage: page,
                        activeRoom: room,
                        lastActiveRoom: (activeRoom ? activeRoom : lastActiveRoom),
                        activeUser: null,
                        lastActiveUser: (activeUser ? activeUser : lastActiveUser)
                    });
                    this.connection.invoke(chatApp().hubPushRoomMessages, room.name).catch(err => console.error(err.toString()));
                } else {
                    let thePublicRoom = rooms.find(r => r.name == publicRoomName);
                    if (!thePublicRoom) { thePublicRoom = { name: publicRoomName }; }
                    this.setState({ activePage: page, activeRoom: thePublicRoom });
                    this.connection.invoke(chatApp().hubPushRoomMessages, publicRoomName).catch(err => console.error(err.toString()));
                }

                break;

            default: throw new DOMException(`No page ${page}`); break;
        }
    }


    // GET DATA
    getData = () => this.connection.invoke(chatApp().hubGetData).catch(err => console.error(err.toString()));

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
        const { publicRoomName, roomModelNamePropertyName } = chatApp();
        const publicRoom = roomModels.find(r => r.name === publicRoomName);
        roomModels = this.sortByProperty(roomModelNamePropertyName, roomModels.filter(r => r.name !== publicRoomName));
        // setState
        this.setState({ rooms: [publicRoom, ...roomModels] });
    }

    // CREATE ROOM
    createRoom = (roomName) => this.connection.invoke(chatApp().hubCreateRoom, roomName).catch(err => console.error(err.toString()));

    // JOIN ROOM
    joinRoom = (roomName) => this.connection.invoke(chatApp().hubJoinRoom, roomName).catch(err => console.error(err.toString()));

    // LEAVE ROOM
    leaveRoom = (roomName) => this.connection.invoke(chatApp().hubLeaveRoom, roomName).catch(err => console.error(err.toString()));


    /////////////


    // PUSH USERS
    pushUsers = (userModels) => {
        const { userUsernamePropertyName } = chatApp();
        console.log('Users:' + userModels.length);
        //console.log(userModels);
        this.setState({ users: this.sortByProperty(userUsernamePropertyName, userModels) });
    }

    // USER ONLINE
    userOnline = (userModel) => {
        const { userUsernamePropertyName } = chatApp();
        //console.log(userModel);
        this.userOffline(userModel.username);
        const userModels = this.sortByProperty(userUsernamePropertyName, [...this.state.users, userModel]);
        this.setState({ users: userModels });
    }

    // USER OFFLINE
    userOffline = (username) => {
        const { userUsernamePropertyName } = chatApp();
        this.setState({ users: this.sortByProperty(userUsernamePropertyName, this.state.users.filter(user => user.username !== username)) });
    }


    /////////////


    // PUSH MESSAGES
    pushMessages = (messageModels) => this.setState({ messages: messageModels });

    // SEND MESSAGE
    sendMessage = (messageText) => {

        const { sendPublicMessage, sendMessageToGroup, sendPrivateMessage } = chatApp();
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


    /////////////

    sortByProperty = (property, collection) => collection.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));


    // RENDER
    render() {
        const { youAre, rooms, users, messages, activeRoom, lastActiveRoom, activeUser, lastActiveUser, activePage } = this.state;
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
                        messages={messages}
                        ref="messages"
                        youAre={youAre}
                        activeRoom={activeRoom}
                        activeRoom={activeRoom}
                        activeUser={activeUser}
                        lastActiveRoom={lastActiveRoom}
                        lastActiveUser={lastActiveUser}
                        sendMessage={this.sendMessage}
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
                    <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('AllUsers')}><ArrowsLeft /> All <IconAllUsers /></button>

                    <button className="btn btn-sm btn-primary" disabled><IconRooms /> : {rooms.length}</button>

                    <button className="btn btn-sm btn-primary float-right" onClick={() => activeRoom ? setPage('Chat', activeRoom, null) : setPage('Chat', null, activeUser)}>
                        {activeRoom ? <span> <IconRoom /> {activeRoom.name} {SetIconPublic(activeRoom.name)}</span> : <span> <IconUser />  User: {activeUser.username}  </span>} <ArrowsRight />
                    </button>
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

                { // Room button
                    <button className={`btn btn-sm btn-${(activeRoom && name === activeRoom.name) ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                        datatoggle="tooltip" title={(activeRoom && name === activeRoom.name) ? 'This is your current room.' : (isMember ? 'Chat!' : 'You need to join the room.')}
                        disabled={!isMember} onClick={() => setPage('Chat', room, null)} >
                        <IconRoom /> {name} {SetIconPublic(name)}
                    </button>
                }

                { // Members button
                    <button className={`btn btn-sm btn-${(activeRoom && name === activeRoom.name) ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                        datatoggle="tooltip" title={isMember ? 'See Room Members' : 'You need to join the room.'}
                        disabled={!isMember} onClick={() => setPage('Users', room, null)} ><IconUsers />: {membersCount} </button>
                }

                { // Join / Leave button
                    <div className="ml-auto">
                        {!isMember && <JoinLeaveButton isMember={false} roomName={name} onClick={this.onJoin} />}
                        {isMember && <JoinLeaveButton isMember={true} roomName={name} onClick={this.onLeave} />}
                    </div>
                }

            </div >
        )
    }
}

// JOIN/LEAVE BUTTON
class JoinLeaveButton extends React.Component {
    render() {
        const { isMember, roomName, onClick } = this.props;
        return (
            <form>
                <input type="hidden" name="roomName" value={roomName} />
                <button className={`btn btn-sm btn-outline-${!isMember ? 'success' : 'danger'} mx-1 px-2 rounded`}
                    datatoggle="tooltip" title={!isMember ? 'Join' : 'Leave'} onClick={onClick}>
                    <i className={`fas fa-sign-${!isMember ? 'in' : 'out'}-alt`}></i>
                </button>
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

                <button type="submit" className="btn btn-primary mx-1" title="Create Room"><IconAdd /></button>
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
                    <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Rooms', activeRoom ? activeRoom : lastActiveRoom)}><ArrowsLeft /> <IconRooms /></button>

                    <button className="btn btn-sm btn-primary" disabled>
                        {activeRoom ? <span><IconUsers /> in <IconRoom /> {activeRoom.name} {SetIconPublic(activeRoom.name)}  </span> : <span><IconAllUsers /> All Users</span>}: {users.length}</button>
                    <button className="btn btn-sm btn-primary float-right" onClick={() => setPage('Chat', activeRoom ? activeRoom : lastActiveRoom)}><IconMessages /> <ArrowsRight /></button>
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
        const { formatDate, formatTimeShort } = chatApp();
        const { user, setPage, } = this.props;
        const { username, isOnline, onlineAtUTC } = user;
        return (
            <div className="my-1 d-flex">
                <button className={`btn btn-${isOnline ? 'success' : 'danger'} mx-2 px-2 rounded`} onClick={() => setPage('Chat', null, user)}><IconUser /> {username}</button>
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
        const { youAre, messages, sendMessage, activeRoom, lastActiveRoom, activeUser, setPage } = this.props;
        const room = activeRoom ? activeRoom : lastActiveRoom;
        return (
            <div className="col h-100 bg-light border p-0">
                <div className="bg-dark text-center border-bottom p-2 my-0">

                    {/* << Rooms button */}
                    {<button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Rooms', room)}><ArrowsLeft /> <IconRooms /></button>}

                    {/* Room / User */}
                    {activeRoom && <button disabled className="btn btn-sm btn-primary"><IconRoom /> {room.name}</button>}
                    {activeUser && <button disabled className={`btn btn-sm btn-${activeUser.isOnline ? 'success' : 'danger'}`}><IconUser /> User: {activeUser.username}</button>}

                    {/* button Members >>  */}
                    {<button className="btn btn-sm btn-primary float-right" onClick={() => setPage('Users', room)}>
                        <IconUsers /> <ArrowsRight />
                    </button>}

                </div>

                <MessagesList messages={messages} filter={filter} youAre={youAre} />
                <MessagesFooter ref="messagesFooter" sendMessage={sendMessage} filter={filter} />
            </div>
        )
    }
}

// MESSAGES LIST
class MessagesList extends React.Component {
    render() {
        const { messages, filter, youAre } = this.props;
        console.log(filter.term);
        let msgs = messages.filter(m => m.text.includes(filter.term));
        return (
            <div id="messagesList" className="p-2">
                {(msgs.length > 0) &&
                    <div>
                        {filter.term && <div className="text-center bg-warning p-3 m-5 rounded shadow display-4">Messages containing <br /> '{filter.term}'</div>}
                        <div>{msgs.map((msg, ix) => <MessageItem key={ix} msg={msg} youAre={youAre} />)}</div>
                    </div>}
                {(msgs.length == 0)
                    && <div className="text-center bg-warning p-3 mx-3 my-5 rounded shadow display-4">No Messages {filter.term ? <span><br />containing '{filter.term}'</span> : ''}</div>}
            </div>
        )
    }
}

// MESSAGE ITEM
class MessageItem extends React.Component {
    render() {
        //console.log(this.props.msg);
        const { userCircleSize, formatDate, formatTimeLong } = chatApp();
        const { youAre, msg } = this.props;
        const { sender, text, timeSent } = msg;
        const isYou = (sender.username === youAre);
        const justify = 'd-flex justify-content-' + (isYou ? 'end' : 'start');
        return (
            <div>
                <div className={`my-1 ${justify}`}>
                    <div className="bg-primary mx-2 px-2 rounded-circle"
                        style={{ height: userCircleSize, width: userCircleSize, order: (isYou ? 1 : -1) }}>{sender.username}</div>
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
        const { sendMessage, filter } = this.props;
        return (
            <div className="w-100 bg-dark border-top d-flex py-2">
                {!showFilter
                    ? <div className="d-flex w-100"><button className="btn btn-sm btn-warning mx-1" title="Toggle Filter" onClick={() => this.onToggle()}><IconToggleOff /></button> <SendMessage ref="sendMessage" sendMessage={sendMessage} /></div>
                    : <div className="d-flex w-100"><button className="btn btn-sm btn-warning mx-1" title="Toggle Filter" onClick={() => this.onToggle()}><IconToggleOn /></button> <FilterMessages filter={filter} /></div>
                }
            </div>
        )
    }
}


// SEND MESSAGE
class SendMessage extends React.Component {

    state = { message: '' }

    onSubmit = (e) => {
        e.preventDefault();
        const message = this.state.message.trim();
        if (message) {
            this.props.sendMessage(message);
            this.setState({ message: '' });
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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

                <button type="submit" className="btn btn-primary mx-1" title="Send"><IconSend /></button>
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

                <button type="submit" className="btn btn-sm btn-primary mx-1" title="Filter"><IconClearFilter /></button>

            </form>
        )
    }
}


const SetIconPublic = (roomName) => (roomName === chatApp().publicRoomName) && <IconPublic />;
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
const IconSend = () => <i className="far fa-share-square"></i>;
const IconAdd = () => <i className="fas fa-plus"></i>;
const IconToggleOn = () => <i className="fas fa-toggle-on"></i>;
const IconToggleOff = () => <i className="fas fa-toggle-off"></i>;
const IconClearFilter = () => < span className="fa-stack" > <i className="fa fa-filter fa-stack-1x"></i> <i className="fa fa-ban fa-stack-2x text-danger"></i></span>;
const IconGithub = () => < i className="fab fa-github" ></i>;


const domContainer = document.querySelector('#root');
if (domContainer) { ReactDOM.render(<App />, domContainer); }
