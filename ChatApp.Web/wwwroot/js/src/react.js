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
        hubOpenUser: 'OpenUser',

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
    }
});



// APP
class App extends React.Component {

    connection;

    state = {
        connection: null, youAre: null,
        rooms: [], users: [], messages: [],
        activeRoom: null, activeUser: null, activePage: 'Rooms'
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
        this.connection.on(youAre, username => this.youAre(username));
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
        if (!this.state.activeRoom && !this.state.activeUser) {
            this.setState({ activePage: 'Rooms', activeRoom: chatApp().publicRoom });
        }
    }

    // YOU ARE
    youAre = (username) => this.setState({ youAre: username });


    // NOTIFY
    notify = (message) => { alert(message); };

    // SET PAGE
    setPage = (page) => this.setState({ activePage: page });


    // REFRESH ROOMS
    refreshRooms = (rooms) => {
        const publicRoomName = chatApp().publicRoom;
        const publicRoom = rooms.filter(r => r.name === publicRoomName)[0];
        rooms = rooms.filter(r => r.name !== publicRoomName);
        this.setState({ rooms: [publicRoom, ...rooms] });
    }

    // CREATE ROOM
    createRoom = (roomName) => this.connection.invoke(chatApp().hubCreateRoom, roomName).catch(err => console.error(err.toString()));

    // OPEN ROOM
    openRoom = (roomName) => {
        this.setState({ activeRoom: roomName, activeUser: null, activePage: 'Chat' });
        this.connection.invoke(chatApp().hubOpenRoom, roomName).catch(err => console.error(err.toString()));
    }

    // JOIN ROOM
    joinRoom = (roomName) => this.connection.invoke(chatApp().hubJoinRoom, roomName).catch(err => console.error(err.toString()));

    // LEAVE ROOM
    leaveRoom = (roomName) => this.connection.invoke(chatApp().hubLeaveRoom, roomName).catch(err => console.error(err.toString()));



    // REFRESH USERS
    refreshUsers = (userModels) => {
        console.log(userModels);
        this.setState({ users: userModels.sort((a,b) => this.sortByUsername(a,b)) });
    }


    // SELECT USER
    selectUser = (username) => this.setState({ activeRoom: null, activeUser: username, activePage: 'Chat' });

    // USER ONLINE
    userOnline = (userModel) => {
        //console.log(userModel);
        this.userOffline(userModel.username);
        const userModels = [...this.state.users, userModel]
            .sort((a, b) => this.sortByUsername(a, b));
        this.setState({ users: userModels });
    }


    // USER OFFLINE
    userOffline = (username) => {
        this.setState({
            users: this.state.users
                .filter(user => user.username !== username)
                .sort((a, b) => this.sortByUsername(a,b))
        });
    }


    sortByUsername = (a, b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0);


    // REFRESH MESSAGES
    refreshMessages = (messageModels) => this.setState({ messages: messageModels });

    // SEND MESSAGE
    sendMessage = (messageText) => {

        const { sendPublicMessage, sendMessageToGroup, sendPrivateMessage } = chatApp();
        const { activeRoom, activeUser } = this.state;

        if (activeUser) { // private message to another user
            console.log('sending to user: ' + activeUser);
            this.connection.invoke(sendPrivateMessage, activeUser, messageText).catch(err => console.error(err.toString()));
        }
        else if (activeRoom) { // message to a given room
            console.log('sending to room: ' + activeRoom);
            this.connection.invoke(sendMessageToGroup, activeRoom, messageText).catch(err => console.error(err.toString()));
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
            .refs.sendMessage
            .refs.messageInput.focus();
    }

    // RECEIVE MESSAGE
    receiveMessage = (messageModel) => {
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


    // RENDER
    render() {
        const { youAre, rooms, users, messages, activeRoom, activeUser, activePage } = this.state;
        return (
            <div className="row bg-light rounded border shadow h-100">
                {(activePage == 'Rooms') && <Rooms rooms={rooms} activeRoom={activeRoom} createRoom={this.createRoom} onOpenRoom={this.openRoom} onJoin={this.joinRoom} onLeave={this.leaveRoom} />}
                {(activePage == 'Users') && <Users youAre={youAre} roomName={activeRoom} users={users} selectUser={this.selectUser} setPage={this.setPage} />}
                {(activePage == 'Chat') && <Messages ref="messages" youAre={youAre} messages={messages} activeRoom={activeRoom} activeUser={activeUser} sendMessage={this.sendMessage} setPage={this.setPage} />}
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
            <div className="col h-100 text-center bg-warning border p-0">
                <div className="text-center border-bottom p-2 my-0"><button className="btn btn-sm btn-primary">Rooms</button></div>
                <RoomsList rooms={rooms} activeRoom={activeRoom} onOpenRoom={onOpenRoom} onJoin={onJoin} onLeave={onLeave} />
                <CreateRoom createRoom={createRoom} />
            </div>
        )
    }
}

// ROOMS LIST
class RoomsList extends React.Component {
    render() {
        const { rooms, activeRoom, onOpenRoom, onJoin, onLeave } = this.props;
        return (
            <div id="roomsList" className="p-2">
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
            <div className="bg-secondary d-flex p-1 my-2 rounded border shadow">
                <button className={`btn btn-sm btn-${name === activeRoom ? 'primary' : (isMember ? 'success' : 'danger')} mx-1 px-2 rounded`}
                    disabled={!isMember} datatoggle="tooltip"
                    title={name === activeRoom ? 'This is your current room.' : (isMember ? 'Go To Room' : '')}
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

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

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
        const { youAre, users, roomName, selectUser, setPage } = this.props;
        return (
            <div className="col h-100 bg-secondary border p-0">
                <div className=" text-center border-bottom p-2 my-0">

                    <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Rooms')}>
                        <i className="fas fa-angle-double-left"></i> Rooms</button>

                    <button className="btn btn-sm btn-primary">Members of ''{roomName}''</button>

                    <button className="btn btn-sm btn-primary float-right" onClick={() => setPage('Chat')}>
                        Chat <i className="fas fa-angle-double-right"></i></button>
                </div>

                <UsersList youAre={youAre} users={users} selectUser={selectUser} />
            </div>
        )
    }
}

// USERS LIST
class UsersList extends React.Component {
    render() {
        const { youAre, users, selectUser } = this.props;
        return (
            <div id="usersList" className="p-2">
                {users.filter(u => u.username !== youAre).map((user, ix) => <UserItem key={ix} user={user} selectUser={selectUser} />)}
            </div>
        )
    }
}

// USER ITEM
class UserItem extends React.Component {
    render() {
        const { formatDate, formatTimeShort } = chatApp();
        const { username, isOnline, onlineAtUTC } = this.props.user;
        console.log(onlineAtUTC);
        return (
            <div className="my-1 d-flex">
                <button className={`btn btn-${isOnline ? 'success' : 'danger'} mx-2 px-2 rounded`} onClick={() => this.props.selectUser(username)}>{username}</button>
                {isOnline && <div className="bg-warning mx-2 px-2 rounded ml-auto">{formatDate(new Date(onlineAtUTC), formatTimeShort)}</div >}
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
        const { youAre, messages, sendMessage, activeRoom, activeUser, setPage } = this.props;
        return (
            <div className="col h-100 bg-light border p-0">
                <div className="text-center border-bottom p-2 my-0">

                    <button className="btn btn-sm btn-primary float-left" onClick={() => setPage('Users')}>
                        <i className="fas fa-angle-double-left"></i> Users</button>

                    {activeRoom && <button className="btn btn-sm btn-primary">Room: {activeRoom}</button>}
                    {activeUser && <button className="btn btn-sm btn-primary">User: {activeUser}</button>}

                </div>
                <MessagesList messages={messages} youAre={youAre} />
                <SendMessage ref="sendMessage" sendMessage={sendMessage} />
            </div>
        )
    }
}

// MESSAGES LIST
class MessagesList extends React.Component {
    render() {
        const { messages, youAre } = this.props;
        return (
            <div id="messagesList" className="p-2">
                {messages.map((msg, ix) => <MessageItem key={ix} msg={msg} youAre={youAre} />)}
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
                className="w-100 bg-dark border-top d-flex py-2">

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
