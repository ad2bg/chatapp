//import LikeButton from './components/LikeButton'


const chatApp = (() => {
    return {
        // connection
        connectionUrl: '/chatHub',

        // server-side methods
        sendPublicMessage: 'SendPublicMessage',
        sendMessageToGroup: 'SendMessageToGroup',
        sendPrivateMessage: 'SendPrivateMessage',
        hubGetData: 'GetData',
        hubCreateRoom: 'CreateRoom',
        hubOpenRoom: 'OpenRoom',
        hubJoinRoom: 'JoinRoom',
        hubLeaveRoom: 'LeaveRoom',

        // client-side methods
        getData: "getData",
        youAre: "youAre",
        userOnline: "userOnline",
        userOffline: "userOffline",
        receiveMessage: "receiveMessage",
        notify: "notify",
        refreshRooms: "refreshRooms",
        refreshUsers: "refreshUsers",
        refreshMessages: "refreshMessages",

        // other constants
        publicRoom: 'Public',
        you: 'You',
        headersHeight: '2.9em',
        listsHeight: '- 6.4em',
        footersHeight: '3.5em',
        shortTimeFormat: 'HH:NN',
        formatDate: (dateObj, format = 'yyyy/mm/dd') => {
            if (!dateObj || 'now' === dateObj) dateObj = new Date();

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
            format = format.replace('yyyy', year)
            format = format.replace('yy', year % 100)
            format = format.replace('mm', pad(month, 2))
            format = format.replace('m', month)
            format = format.replace('wwww', day)
            format = format.replace('www', day.substring(0, 3))
            format = format.replace('ww', day.substring(0, 2))
            format = format.replace('dd', pad(date, 2))
            format = format.replace('d', date)
            format = format.replace('hh', pad(hours, 2))
            format = format.replace('h', hours)
            format = format.replace('nn', pad(minutes, 2))
            format = format.replace('n', minutes)
            format = format.replace('ss', pad(seconds, 2))
            format = format.replace('s', seconds)
            format = format.replace('lll', pad(milliseconds, 3))
            return format;
        },
        userCircleSize: 50
    }
});



// APP
class App extends React.Component {

    connection;

    state = {
        connection: null, youAre: null,
        rooms: [], users: [], messages: [],
        activeRoom: null, activeUser: null
    }

    componentDidMount() {

        const { connectionUrl, getData, youAre, userOnline, userOffline, receiveMessage, notify, refreshRooms, refreshUsers, refreshMessages } = chatApp();

        // set connection
        // LogLevel: Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
        this.connection = new signalR.HubConnectionBuilder().withUrl(connectionUrl)
            .configureLogging(signalR.LogLevel.Information).build()

        // start the connection (and restart it as necessary)
        const startConnection = async () => await this.connection.start()
            .then(() => {
                let now = new Date();
                now = now.toUTCString();
                console.log('>> Connection started ' + now);
                this.getData();
            })
            .catch(err => console.error(err.toString()));
        startConnection();
        this.connection.onclose(async () => {
            let now = new Date();
            now = now.toUTCString();
            console.log('>> Connection closed ' + now);
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
        this.connection.on(youAre, () => this.youAre());
        this.connection.on(userOnline, username => this.userOnline(username));
        this.connection.on(userOffline, username => this.userOffline(username));
        this.connection.on(receiveMessage, (user, messageText) => this.receiveMessage(user, messageText));
        this.connection.on(notify, message => this.notify(message));
        this.connection.on(refreshRooms, rooms => this.refreshRooms(rooms));
        this.connection.on(refreshUsers, users => this.refreshUsers(users));
        this.connection.on(refreshMessages, messages => this.refreshMessages(messages));
    }


    // GET DATA
    getData = () => {
        this.connection.invoke(chatApp().hubGetData).catch(err => console.error(err.toString()));
        if (!this.state.activeRoom && !this.state.activeUser) { this.openRoom(chatApp().publicRoom) }
    }

    // YOU ARE
    youAre = (username) => this.setState({ youAre: username });

    // NOTIFY
    notify = (message) => { alert(message); };



    // REFRESH ROOMS
    refreshRooms = (rooms) => this.setState({ rooms: rooms });

    // CREATE ROOM
    createRoom = (roomName) => this.connection.invoke(chatApp().hubCreateRoom, roomName).catch(err => console.error(err.toString()));

    // OPEN ROOM
    openRoom = (roomName) => {
        this.setState({ activeRoom: roomName });
        this.setState({ activeUser: null });
        this.connection.invoke(chatApp().hubOpenRoom, roomName).catch(err => console.error(err.toString()));
    }

    // JOIN ROOM
    joinRoom = (roomName) => this.connection.invoke(chatApp().hubJoinRoom, roomName).catch(err => console.error(err.toString()));

    // LEAVE ROOM
    leaveRoom = (roomName) => this.connection.invoke(chatApp().hubLeaveRoom, roomName).catch(err => console.error(err.toString()));



    // REFRESH USERS
    refreshUsers = (users) => {
        //console.log(users);
        this.setState({ users: users });
    }

    // SELECT USER
    selectUser = (username) => {
        //console.log(username);
        this.setState({ activeRoom: null });
        this.setState({ activeUser: username });
    }

    // USER ONLINE
    userOnline = (username) => {
        const now = new Date();
        const user = { username, joinedAt: now };
        this.setState({
            users: [...this.state.users,
                //user
            ]
        });
    }

    // USER OFFLINE
    userOffline = (username) => {
        const { users } = this.state;
        this.setState({
            users: users.filter(user => user.username !== username)
        });
    }



    // REFRESH MESSAGES
    refreshMessages = (messages) => {
        //console.log(messages);
        this.setState({ messages: messages });
    }

    // SEND MESSAGE
    sendMessage = (message) => {

        // console.log(message);
        const { sendPublicMessage, sendMessageToGroup, sendPrivateMessage } = chatApp();
        const { activeRoom, activeUser } = this.state;

        if (activeUser) { // to user
            this.connection.invoke(sendPrivateMessage, activeUser, message).catch(err => console.error(err.toString()));
        }
        else if (activeRoom) { // to room
            this.connection.invoke(sendMessageToGroup, activeRoom, message).catch(err => console.error(err.toString()));
        }
        else { // public
            this.connection.invoke(sendPublicMessage, message).catch(err => console.error(err.toString()));
        }

        this.refs.messages
            .refs.sendMessage
            .refs.messageInput.focus();
    }

    // RECEIVE MESSAGE
    receiveMessage = (user, messageText) => {
        messageText = this.escapeHtml(messageText);
        this.setState({ messages: [...this.state.messages, { user: user, text: messageText }] })
    }

    escapeHtml = (unsafeText) => {
        return unsafeText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }


    // RENDER
    render() {
        const { youAre, rooms, users, messages, activeRoom, activeUser } = this.state;
        return (
            <div className="row bg-light rounded border shadow h-100">
                <Rooms rooms={rooms} activeRoom={activeRoom} createRoom={this.createRoom} onOpenRoom={this.openRoom} onJoin={this.joinRoom} onLeave={this.leaveRoom} />
                <Users youAre={youAre} roomName={activeRoom} users={users} selectUser={this.selectUser} />
                <Messages ref="messages" messages={messages} activeRoom={activeRoom} activeUser={activeUser} sendMessage={this.sendMessage} />
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
        const { rooms, activeRoom, createRoom, onOpenRoom, onJoin, onLeave } = this.props;
        return (
            <div className="col-md-3 bg-warning border p-0">
                <div className="border-bottom p-2 my-0" style={{ height: chatApp().headersHeight }} ><button className="btn btn-sm btn-primary">Rooms</button></div>
                <RoomsList rooms={rooms} activeRoom={activeRoom} onOpenRoom={onOpenRoom} onJoin={onJoin} onLeave={onLeave} />
                <CreateRoom createRoom={createRoom} />
            </div>
        )
    }
}

// ROOMS LIST
class RoomsList extends React.Component {
    render() {
        const { listsHeight } = chatApp();
        const { rooms, activeRoom, onOpenRoom, onJoin, onLeave } = this.props;
        return (
            <div className="p-2" style={{ height: `calc(100% ${listsHeight})`, overflowY: "scroll" }}>
                {rooms.map((room, ix) => <RoomItem key={ix} room={room} activeRoom={activeRoom} onOpenRoom={onOpenRoom} onJoin={onJoin} onLeave={onLeave} />)}
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
        const { activeRoom } = this.props;
        const { name, isMember } = this.props.room;
        return (
            <div className="my-1 d-flex">
                <button className={`btn btn-sm btn-${name === activeRoom ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                    disabled={!isMember || (name === activeRoom)} datatoggle="tooltip"
                    title={name === activeRoom ? 'You are in this room at the moment.' : (isMember ? 'Go To Room' : '')}
                    onClick={() => this.props.onOpenRoom(this.props.room.name)} >{name}</button>

                <div className="ml-auto">
                    {!isMember && <JoinLeaveButton isMember={false} roomName={name} onClick={this.onJoin} />}
                    {isMember && <JoinLeaveButton isMember={true} roomName={name} onClick={this.onLeave} />}
                </div>
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
                <button className={`btn btn-sm btn-${!isMember ? 'success' : 'danger'} mx-1 px-2 rounded`}
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

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { roomName } = this.state;
        return (
            <form onSubmit={this.onSubmit}
                className="w-100 bg-dark border-top d-flex py-2"
                style={{ height: chatApp().footersHeight }}>

                <input type="text"
                    name="roomName"
                    className="form-control mx-1"
                    placeholder="Create Room..."
                    autoFocus={true}
                    value={roomName}
                    onChange={this.onChange}
                />

                <button type="submit" className="btn btn-primary mx-1" title="Create Room">
                    <i className="fas fa-plus"></i>
                </button>

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
        const { youAre, users, roomName, selectUser } = this.props;
        return (
            <div className="col-md-3 bg-secondary border p-0">
                <div className="border-bottom p-2 my-0" style={{ height: chatApp().headersHeight }} >
                    {roomName && <button className="btn btn-sm btn-primary">Members of ''{roomName}''</button>}
                </div>
                <UsersList youAre={youAre} users={users} selectUser={selectUser} />
                <div style={{ height: chatApp().footersHeight }} className="border-top bg-dark"></div>
            </div>
        )
    }
}

// USERS LIST
class UsersList extends React.Component {
    render() {
        const { listsHeight } = chatApp();
        const { youAre, users, selectUser } = this.props;
        return (
            <div className="p-2" style={{ height: `calc(100% ${listsHeight})`, overflowY: "scroll" }}>
                {users.filter(u => u.username !== youAre).map((user, ix) => <UserItem key={ix} user={user} selectUser={selectUser} />)}
            </div>
        )
    }
}

// USER ITEM
class UserItem extends React.Component {
    render() {
        const { formatDate, shortTimeFormat } = chatApp();
        const { username, joinedAt } = this.props.user;
        return (
            <div className="my-1 d-flex">
                <button className="bg-primary mx-2 px-2 rounded" onClick={() => this.props.selectUser(username)}>{username}</button>
                <div className="bg-warning mx-2 px-2 rounded ml-auto">{formatDate(joinedAt, shortTimeFormat)}</div >
            </div>
        )
    }
}



/////////////////
//  MESSAAGES  //
/////////////////

// MESSAGES
class Messages extends React.Component {
    render() {
        const { messages, sendMessage, activeRoom, activeUser } = this.props;
        return (
            <div className="col-md-6 bg-light border p-0">
                <div className="border-bottom p-2 my-0" style={{ height: chatApp().headersHeight }} >
                    {activeRoom && <button className="btn btn-sm btn-primary">Room: {activeRoom}</button>}
                    {activeUser && <button className="btn btn-sm btn-primary">User: {activeUser}</button>}
                </div>
                <MessagesList messages={messages} />
                <SendMessage ref="sendMessage" sendMessage={sendMessage} />
            </div>
        )
    }
}

// MESSAGES LIST
class MessagesList extends React.Component {
    render() {
        const { listsHeight } = chatApp();
        const { messages } = this.props;
        return (
            <div id="messagesList" className="p-2" style={{ height: `calc(100% ${listsHeight})`, overflowY: "scroll" }}>
                {messages.map((msg, ix) => <MessageItem key={ix} msg={msg} />)}
            </div>
        )
    }
}

// MESSAGE ITEM
class MessageItem extends React.Component {
    render() {
        const { user, text } = this.props.msg;
        const { you, userCircleSize } = chatApp();
        const justify = 'd-flex justify-content-' + (user === you ? 'end' : 'start');
        return (
            <div className={`my-1 ${justify}`}>
                <div className="bg-primary mx-2 px-2 rounded-circle" style={{ height: userCircleSize, width: userCircleSize, order: (user == you ? 1 : -1) }}>{user}</div>
                <div className="bg-warning mx-2 px-2 rounded">{text}</div >
            </div>
        )
    }
}

// SEND MESSAGE
class SendMessage extends React.Component {

    state = {
        message: ''
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
        this.setState({ [e.target.name]: e.target.value });
    };

    componentDidUpdate() {
        const objDiv = document.getElementById("messagesList");
        objDiv.scrollTop = objDiv.scrollHeight + 100;
    }

    render() {
        const { message } = this.state;
        return (
            <form onSubmit={this.onSubmit}
                className="w-100 bg-dark border-top d-flex py-2"
                style={{ height: chatApp().footersHeight }}>

                <input type="text"
                    ref="messageInput"
                    name="message"
                    className="form-control mx-1"
                    placeholder="Send message..."
                    autoFocus={true}
                    value={message}
                    onChange={this.onChange}
                />

                <button type="submit" className="btn btn-primary mx-1" title="Send">
                    <i className="far fa-share-square"></i>
                </button>

            </form>
        )
    }
}


const domContainer = document.querySelector('#root');
if (domContainer) { ReactDOM.render(<App />, domContainer); }
