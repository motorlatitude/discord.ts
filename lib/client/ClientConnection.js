"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Node Modules
var zlib = require("zlib");
// NPM Modules
var WebSocket = require("ws");
var ClientDispatcher_1 = require("./ClientDispatcher");
var ConnectFlow_1 = require("./ConnectFlow");
// Constants
var gateway_1 = require("../common/constants/gateway");
/**
 * Handles Connection With The Discord Gateway Server
 */
var ClientConnection = /** @class */ (function () {
    /**
     * Create a new connection with discords gateway server
     * @param app - pass parent class as parameter to modify accessible vars and pass events through
     * @param log
     */
    function ClientConnection(app, log) {
        this.GatewaySequence = 0;
        this.GatewayPings = [];
        this.GatewayPing = 0;
        this.GatewaySessionId = '';
        this.GatewayHeartbeatInterval = 0;
        this.GatewayProtocolVersion = 6;
        this.resuming = false;
        this.App = app;
        this.logger = log;
        this.dispatcher = new ClientDispatcher_1.default(app, this, log);
        this.connector = new ConnectFlow_1.default(this, log, app.token);
    }
    ClientConnection.CanUseCompression = function () {
        return !!zlib.inflateSync;
    };
    /**
     * Connect to discord gateway
     * @param LocalGatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
     * @returns GatewayWebsocket - Websocket connection
     */
    ClientConnection.prototype.connect = function (LocalGatewayURL) {
        this.logger.write().debug({
            message: 'Creating New Gateway Connection',
            service: 'ClientConnection.connect',
        });
        this.GatewayURL = LocalGatewayURL + '/?v=6';
        this.GatewayWebsocket = new WebSocket(this.GatewayURL); // Specify Version
        // Handle websocket events
        this.GatewayWebsocket.once('open', this.GatewayOpen.bind(this));
        this.GatewayWebsocket.once('close', this.GatewayClose.bind(this));
        this.GatewayWebsocket.once('error', this.GatewayError.bind(this));
        this.GatewayWebsocket.on('message', this.GatewayMessage.bind(this));
        return this.GatewayWebsocket;
    };
    /**
     * Send Message To Gateway Websocket Server
     * @param op - OpCode for message
     * @param data - message body
     */
    ClientConnection.prototype.send = function (op, data) {
        var GatewayPackage = {
            d: data,
            op: op,
        };
        if (this.GatewayWebsocket && this.GatewayWebsocket.readyState === WebSocket.OPEN) {
            this.GatewayWebsocket.send(JSON.stringify(GatewayPackage));
            this.logger.write().debug({
                message: 'Successfully Sent A Message To Discord Gateway Server With OpCode: ' + op,
                service: 'ClientConnection.send',
            });
        }
        else {
            this.logger.write().warn({
                details: GatewayPackage,
                message: "Couldn't Send A Message To Discord Gateway Server: Socket Not Open",
                service: 'ClientConnection.send',
            });
        }
    };
    ClientConnection.prototype.SetStatus = function (status, type, state) {
        if (status === void 0) { status = ''; }
        if (type === void 0) { type = 2; }
        if (state === void 0) { state = 'online'; }
        var since = null;
        var game = null;
        if (status) {
            game = {
                name: status,
                type: type,
            };
        }
        if (state === 'idle') {
            since = new Date().getTime();
        }
        var DataMessage = {
            afk: false,
            game: game,
            since: since,
            status: state,
        };
        this.send(3, DataMessage);
    };
    /**
     * Handles GatewayWebsocket `error` event
     */
    ClientConnection.prototype.GatewayError = function (error) {
        this.logger.write().error({
            message: error,
            service: 'ClientConnection.GatewayWebsocket.GatewayError',
        });
    };
    /**
     * Handles GatewayWebsocket `close` event
     */
    ClientConnection.prototype.GatewayClose = function () {
        var _this = this;
        this.logger.write().warn({
            message: 'Connection to Gateway Server was Closed',
            service: 'ClientConnection.GatewayWebsocket.GatewayClose',
        });
        this.logger.write().info({
            message: 'Attempting to Reestablish Connection to Gateway Server',
            service: 'ClientConnection.GatewayWebsocket.GatewayClose',
        });
        // Attempt to resume the connection after 41 seconds
        clearInterval(this.GatewayHeartbeat);
        setTimeout(function () {
            _this.resuming = true;
            _this.connect();
        }, 5000);
    };
    /**
     * Handles GatewayWebsocket `open` event
     */
    ClientConnection.prototype.GatewayOpen = function () {
        this.logger.write().info({
            message: 'Successfully Connected to Gateway Server',
            service: 'ClientConnection.GatewayWebsocket.GatewayOpen',
        });
    };
    /**
     * Handles GatewayWebsocket `message` event
     * @param message - websocket message
     */
    ClientConnection.prototype.GatewayMessage = function (message) {
        var _this = this;
        var data;
        if (typeof message === 'string') {
            // message is json
            data = JSON.parse(message);
        }
        else {
            // message is buffer
            // @ts-ignore
            var extractedData = zlib.inflateSync(message).toString();
            data = JSON.parse(extractedData);
        }
        // Handle Receivable Messages OpCodes: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
        switch (data.op) {
            case gateway_1.default.DISPATCH: {
                this.dispatcher.Parse(data);
                break;
            }
            case gateway_1.default.HEARTBEAT: {
                break;
            }
            case gateway_1.default.RECONNECT: {
                clearInterval(this.GatewayHeartbeat);
                this.resuming = true;
                this.connector.Reconnect();
                break;
            }
            case gateway_1.default.INVALID_SESSION: {
                if (data.d) {
                    // Session is resumable
                    clearInterval(this.GatewayHeartbeat);
                    setTimeout(function () {
                        _this.resuming = true;
                        _this.connect();
                    }, 5000);
                }
                else if (this.resuming) {
                    // failed to resume, go through standard flow
                    var simulatedHelloPayload_1 = {
                        _trace: [],
                        heartbeat_interval: this.GatewayHeartbeatInterval,
                    };
                    setTimeout(function () {
                        _this.connector.Start(simulatedHelloPayload_1);
                    }, 4000);
                }
                else {
                    // Couldn't Initialise Session After Receiving OpCode 2 Identify
                    this.logger.write().error({
                        message: new Error('Invalid Session Error: There was an error with the identify payload or the gateway has invalidated an active session'),
                        service: 'ClientConnection.GatewayWebsocket.GatewayMessage.INVALID_SESSION',
                    });
                }
                break;
            }
            case gateway_1.default.HELLO: {
                if (this.resuming) {
                    this.connector.Reconnect();
                }
                else {
                    this.connector.Start(data.d);
                }
                break;
            }
            case gateway_1.default.HEARTBEAT_ACK: {
                this.connector.HeartbeatAcknowledged();
                break;
            }
            default: {
                this.logger.write().warn({
                    message: 'Unhandled Gateway OpCode was received: ' + data.op,
                    service: 'ClientConnection.GatewayWebsocket.GatewayMessage.UNHANDLED_OPCODE',
                });
                break;
            }
        }
    };
    return ClientConnection;
}());
exports.default = ClientConnection;
