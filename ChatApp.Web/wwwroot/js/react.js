import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// connection
var connectionUrl = '/chatHub';

// server-side methods
var sendPublicMessage = 'SendPublicMessage';
var sendMessageToGroup = 'SendMessageToGroup';
var sendPrivateMessage = 'SendPrivateMessage';
var hubJoinRoom = 'JoinRoom';
var hubLeaveRoom = 'LeaveRoom';

// client-side methods
var userOnline = "userOnline";
var userOffline = "userOffline";
var receiveMessage = "receiveMessage";

// UI elements
var messageInput = $('#messageInput');
var toRoomInput = $('#toRoomInput');
var toUserInput = $('#toUserInput');
var roomInput = $('#roomInput');
var messagesList = $('#messagesList');
var usersList = messagesList;

// APP

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, App);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            connection: null,
            rooms: [],
            users: [],
            messages: []
        }, _this.sendMessage = function (message) {

            console.log(message);

            var toRoomName = ''; //toRoomInput.val().trim();
            var toUserName = ''; //toUserInput.val().trim();
            //toRoomInput.val('');
            //toUserInput.val('');


            if (toUserName) {
                // to user
                _this.connection.invoke(sendPrivateMessage, toUserName, message).catch(function (err) {
                    return console.error(err.toString());
                });
            } else if (toRoomName) {
                // to room
                _this.connection.invoke(sendMessageToGroup, toRoomName, message).catch(function (err) {
                    return console.error(err.toString());
                });
            } else {
                // public
                _this.connection.invoke(sendPublicMessage, message).catch(function (err) {
                    return console.error(err.toString());
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var start = function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                    var now;
                    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    now = new Date();
                                    _context2.prev = 1;
                                    _context2.next = 4;
                                    return this.connection.start();

                                case 4:
                                    console.log('connected ' + now.toUTCString);
                                    _context2.next = 11;
                                    break;

                                case 7:
                                    _context2.prev = 7;
                                    _context2.t0 = _context2['catch'](1);

                                    console.log(now.toUTCString + '\n' + _context2.t0);
                                    setTimeout(function () {
                                        return start();
                                    }, 5000);

                                case 11:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this, [[1, 7]]);
                }));

                return function start() {
                    return _ref3.apply(this, arguments);
                };
            }();

            // user online


            // set connection
            // LogLevel: Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
            this.connection = new signalR.HubConnectionBuilder().withUrl(connectionUrl).configureLogging(signalR.LogLevel.Information).build();

            // start the connection (and restart it as necessary)
            this.connection.start().catch(function (err) {
                return console.error(err.toString());
            });

            this.connection.onclose(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return start();

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this2);
            })));

            this.connection.on(userOnline, function (username) {
                var li = $('<li>');
                var now = new Date();
                li.text(username + ' joined at ' + now.toLocaleTimeString());
                usersList.append(li);
            });

            // user offline
            this.connection.on(userOffline, function (username) {
                var li = $('<li>');
                var now = new Date();
                li.text(username + ' left at ' + now.toLocaleTimeString());
                usersList.append(li);
            });

            // RECEIVE MESSAGE
            this.connection.on(receiveMessage, function (user, message) {
                console.log(message);
                _this2.setState({
                    messages: [].concat(_toConsumableArray(_this2.state.messages), [{ text: message }])
                });
            });

            var escapeHtml = function escapeHtml(unsafeText) {
                return unsafeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
            };

            // JOIN ROOM
            var joinRoom = function joinRoom() {
                var roomName = roomInput.val().trim();
                _this2.connection.invoke(hubJoinRoom, roomName).catch(function (err) {
                    return console.error(err.toString());
                });
            };

            // LEAVE ROOM
            var leaveRoom = function leaveRoom() {
                var roomName = roomInput.val().trim();
                _this2.connection.invoke(hubLeaveRoom, roomName).catch(function (err) {
                    return console.error(err.toString());
                });
            };
        }

        // SEND MESSAGE

    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'row bg-light rounded border shadow h-100' },
                React.createElement(Rooms, { rooms: this.state.rooms }),
                React.createElement(Users, { users: this.state.users }),
                React.createElement(Messages, {
                    messages: this.state.messages,
                    onSubmit: this.onSubmit,
                    sendMessage: this.sendMessage
                })
            );
        }
    }]);

    return App;
}(React.Component);

// ROOMS


var Rooms = function (_React$Component2) {
    _inherits(Rooms, _React$Component2);

    function Rooms() {
        _classCallCheck(this, Rooms);

        return _possibleConstructorReturn(this, (Rooms.__proto__ || Object.getPrototypeOf(Rooms)).apply(this, arguments));
    }

    _createClass(Rooms, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'col-md-3 bg-warning border shadow p-2' },
                React.createElement(
                    'h5',
                    null,
                    'Rooms'
                )
            );
        }
    }]);

    return Rooms;
}(React.Component);

// USERS


var Users = function (_React$Component3) {
    _inherits(Users, _React$Component3);

    function Users() {
        _classCallCheck(this, Users);

        return _possibleConstructorReturn(this, (Users.__proto__ || Object.getPrototypeOf(Users)).apply(this, arguments));
    }

    _createClass(Users, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'col-md-3 bg-secondary border shadow p-2' },
                React.createElement(
                    'h5',
                    null,
                    'Members'
                )
            );
        }
    }]);

    return Users;
}(React.Component);

// MESSAGES


var Messages = function (_React$Component4) {
    _inherits(Messages, _React$Component4);

    function Messages() {
        _classCallCheck(this, Messages);

        return _possibleConstructorReturn(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).apply(this, arguments));
    }

    _createClass(Messages, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'col-md-6 bg-light border shadow p-0' },
                React.createElement(
                    'h5',
                    { className: 'p-2' },
                    'Messages'
                ),
                React.createElement(MessageList, { messages: this.props.messages }),
                React.createElement(SendMessage, { onSubmit: this.props.onSubmit, sendMessage: this.props.sendMessage
                })
            );
        }
    }]);

    return Messages;
}(React.Component);

// MESSAGE LIST


var MessageList = function (_React$Component5) {
    _inherits(MessageList, _React$Component5);

    function MessageList() {
        _classCallCheck(this, MessageList);

        return _possibleConstructorReturn(this, (MessageList.__proto__ || Object.getPrototypeOf(MessageList)).apply(this, arguments));
    }

    _createClass(MessageList, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'p-2' },
                this.props.messages.map(function (msg, ix) {
                    return React.createElement(MessageItem, { key: ix, msg: msg });
                })
            );
        }
    }]);

    return MessageList;
}(React.Component);

// MESSAGE ITEM


var MessageItem = function (_React$Component6) {
    _inherits(MessageItem, _React$Component6);

    function MessageItem() {
        _classCallCheck(this, MessageItem);

        return _possibleConstructorReturn(this, (MessageItem.__proto__ || Object.getPrototypeOf(MessageItem)).apply(this, arguments));
    }

    _createClass(MessageItem, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                this.props.msg.text
            );
        }
    }]);

    return MessageItem;
}(React.Component);

// SEND MESSAGE


var SendMessage = function (_React$Component7) {
    _inherits(SendMessage, _React$Component7);

    function SendMessage() {
        var _ref4;

        var _temp2, _this8, _ret2;

        _classCallCheck(this, SendMessage);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this8 = _possibleConstructorReturn(this, (_ref4 = SendMessage.__proto__ || Object.getPrototypeOf(SendMessage)).call.apply(_ref4, [this].concat(args))), _this8), _this8.state = {
            message: ''
        }, _this8.onSubmit = function (e) {
            e.preventDefault();
            _this8.props.sendMessage(_this8.state.message);
            _this8.setState({ message: '' });
        }, _this8.onChange = function (e) {
            console.log(e.target.value);
            _this8.setState(_defineProperty({}, e.target.name, e.target.value));
        }, _temp2), _possibleConstructorReturn(_this8, _ret2);
    }

    _createClass(SendMessage, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'form',
                { id: 'messageInput',
                    onSubmit: this.onSubmit,
                    className: 'w-100 bg-secondary border-top d-flex py-2',
                    style: { position: "absolute", bottom: "0" } },
                React.createElement('input', {
                    id: 'messageInput',
                    type: 'text',
                    name: 'message',
                    className: 'form-control mx-1',
                    placeholder: 'Send message...',
                    autoFocus: true,
                    value: this.state.message,
                    onChange: this.onChange
                }),
                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        className: 'btn btn-primary mx-1' },
                    'Send'
                )
            );
        }
    }]);

    return SendMessage;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(App, null), domContainer);