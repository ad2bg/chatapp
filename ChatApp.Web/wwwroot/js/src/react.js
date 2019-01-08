const chatApp = (() => {
    return {
        // connection
        connectionUrl: '/chatHub',

        // server-side methods
        sendPublicMessage: 'SendPublicMessage',
        sendMessageToGroup: 'SendMessageToGroup',
        sendPrivateMessage: 'SendPrivateMessage',
        hubCreateRoom: 'CreateRoom',
        hubJoinRoom: 'JoinRoom',
        hubLeaveRoom: 'LeaveRoom',

        // client-side methods
        userOnline: "userOnline",
        userOffline: "userOffline",
        receiveMessage: "receiveMessage",

        // other constants
        you: 'You',
        listsHeight: '6.4em',
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
        }
    }
});



// APP
class App extends React.Component {

    connection;

    state = {
        connection: null,
        rooms: [{ name: 'Public' }],
        users: [],
        messages: []
    }

    componentDidMount() {

        const { connectionUrl, userOnline, userOffline, receiveMessage } = chatApp();

        // set connection
        // LogLevel: Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
        this.connection = new signalR.HubConnectionBuilder().withUrl(connectionUrl)
            .configureLogging(signalR.LogLevel.Information).build()


        // start the connection (and restart it as necessary)
        this.connection.start().catch(err => console.error(err.toString()));
        this.connection.onclose(async () => { await start(); });
        async function start() {
            const now = new Date();
            try {
                await this.connection.start();
                console.log('connected ' + now.toUTCString);
            } catch (err) {
                console.log(`${now.toUTCString}\n${err}`);
                setTimeout(() => start(), 5000);
            }
        }



        // user online
        this.connection.on(userOnline, username => {
            const now = new Date();
            this.setState({
                users: [...this.state.users, { username, joinedAt: now }]
            });
        });

        // user offline
        this.connection.on(userOffline, username => {
            const { users } = this.state;
            this.setState({
                users: users.filter(user => user.username !== username)
            });
        });

        // RECEIVE MESSAGE
        this.connection.on(receiveMessage, (user, messageText) => {
            messageText = escapeHtml(messageText);
            this.setState({
                messages: [...this.state.messages, { user: user, text: messageText }]
            })
        });
        const escapeHtml = (unsafeText) => {
            return unsafeText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

    }


    // CREATE ROOM
    createRoom = (roomName) => {
        //console.log('create ' + roomName);
        this.connection.invoke(chatApp().hubCreateRoom, roomName).catch(err => console.error(err.toString()));
    }


    // JOIN ROOM
    joinRoom = (roomName) => {
        //console.log('join ' + roomName);
        this.connection.invoke(chatApp().hubJoinRoom, roomName).catch(err => console.error(err.toString()));
    }

    // LEAVE ROOM
    leaveRoom = (roomName) => {
        //console.log('leave ' + roomName);
        this.connection.invoke(chatApp().hubLeaveRoom, roomName).catch(err => console.error(err.toString()));
    }


    // SEND MESSAGE
    sendMessage = (message) => {

        // console.log(message);
        const { sendPublicMessage, sendMessageToGroup, sendPrivateMessage } = chatApp();

        const toRoomName = ''; //toRoomInput.val().trim();
        const toUserName = ''; //toUserInput.val().trim();


        if (toUserName) {
            // to user
            this.connection
                .invoke(sendPrivateMessage, toUserName, message)
                .catch(err => console.error(err.toString()));
        }
        else if (toRoomName) {
            // to room
            this.connection
                .invoke(sendMessageToGroup, toRoomName, message)
                .catch(err => console.error(err.toString()));
        }
        else {
            // public
            this.connection
                .invoke(sendPublicMessage, message)
                .catch(err => console.error(err.toString()));
        }

        this.refs.messages
            .refs.sendMessage
            .refs.messageInput.focus();
    }

    render() {
        const { rooms, users, messages } = this.state;
        return (
            <div className="row bg-light rounded border shadow h-100">
                <Rooms rooms={rooms} createRoom={this.createRoom} onJoin={this.joinRoom} onLeave={this.leaveRoom} />
                <Users users={users} />
                <Messages ref="messages" messages={messages} sendMessage={this.sendMessage} />
            </div>
        );
    }
}





// ROOMS
class Rooms extends React.Component {
    render() {
        const { rooms, createRoom, onJoin, onLeave } = this.props;
        return (
            <div className="col-md-3 bg-warning border p-0">
                <div className="border-bottom p-2 my-0"><button className="btn btn-sm btn-primary">Rooms</button></div>
                <RoomsList rooms={rooms} onJoin={onJoin} onLeave={onLeave} />
                <CreateRoom createRoom={createRoom} />
            </div>
        )
    }
}


// ROOMS LIST
class RoomsList extends React.Component {
    render() {
        const { listsHeight } = chatApp();
        const { rooms, onJoin, onLeave } = this.props;
        return (
            <div className="p-2" style={{ height: `calc(100% - ${listsHeight})`, msOverflowY: "scroll" }}>
                {rooms.map((room, ix) => <RoomItem key={ix} room={room} onJoin={onJoin} onLeave={onLeave} />)}
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
        const { name } = this.props.room;
        return (
            <div className="my-1 d-flex">
                <p className="bg-primary mx-2 px-2 py-1 rounded">{name}</p>
                <div className="ml-auto">
                    <form>
                        <input type="hidden" name="roomName" value={name} />
                        <button className="btn btn-sm btn-success mx-1 px-2 rounded"
                            datatoggle="tooltip" title="Join" onClick={this.onJoin}>
                            <i className="fas fa-sign-in-alt"></i>
                        </button>
                    </form>
                </div>
                <div>
                    <form>
                        <input type="hidden" name="roomName" value={name} />
                        <button className="btn btn-sm btn-danger mx-1 px-2 rounded"
                            datatoggle="tooltip" title="Leave" onClick={this.onLeave}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}


// CREATE ROOM
class CreateRoom extends React.Component {

    state = { roomName: '' }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.createRoom(this.state.roomName);
        this.setState({ roomName: '' });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { roomName } = this.state;
        return (
            <form onSubmit={this.onSubmit}
                className="w-100 bg-dark border-top d-flex py-2"
                style={{ height: "3.5em" }}>

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





// USERS
class Users extends React.Component {
    render() {
        const { users } = this.props;
        return (
            <div className="col-md-3 bg-secondary border p-0">
                <div className="border-bottom p-2 my-0"><button className="btn btn-sm btn-primary">Members</button></div>
                <UsersList users={users} />
                <div style={{ height: "3.5em" }} className="border-top bg-dark"></div>
            </div>
        )
    }
}


// USERS LIST
class UsersList extends React.Component {
    render() {
        const { listsHeight } = chatApp();
        const { users } = this.props;
        return (
            <div className="p-2" style={{ height: `calc(100% - ${listsHeight})`, msOverflowY: "scroll" }}>
                {users.map((user, ix) => <UserItem key={ix} user={user} />)}
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
                <div className="bg-primary mx-2 px-2 rounded">{username}</div>
                <div className="bg-warning mx-2 px-2 rounded ml-auto">{formatDate(joinedAt, shortTimeFormat)}</div >
            </div>
        )
    }
}





// MESSAGES
class Messages extends React.Component {
    render() {
        const { messages, onSubmit, sendMessage } = this.props;
        return (
            <div className="col-md-6 bg-light border p-0">
                <div className="border-bottom p-2 my-0"><button className="btn btn-sm btn-primary">Messages</button></div>
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
            <div className="p-2" style={{ height: `calc(100% - ${listsHeight})`, msOverflowY: "scroll" }}>
                {messages.map((msg, ix) => <MessageItem key={ix} msg={msg} />)}
            </div>
        )
    }
}


// MESSAGE ITEM
class MessageItem extends React.Component {
    render() {
        const { user, text } = this.props.msg;
        const { you } = chatApp();
        const justify = 'd-flex justify-content-' + (user == you ? 'end' : 'start');
        return (
            <div className={`my-1 ${justify}`}>
                <div className="bg-primary mx-2 px-2 rounded">{user}</div>
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
        this.props.sendMessage(this.state.message);
        this.setState({ message: '' });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { message } = this.state;
        return (
            <form onSubmit={this.onSubmit}
                className="w-100 bg-dark border-top d-flex py-2"
                style={{ height: "3.5em" }}>

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
ReactDOM.render(<App />, domContainer);
