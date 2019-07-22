"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var zlib = require("zlib");
var gateway_1 = require("../common/constants/gateway");
var gatewayerrorcodes_1 = require("../common/constants/gatewayerrorcodes");
var ClientConnectFlow_1 = require("./ClientConnectFlow");
var ClientDispatcher_1 = require("./ClientDispatcher");
/**
 * Handles Connection With The Discord Gateway Server
 */
var ClientConnection = /** @class */ (function () {
    /**
     * Create a new connection with discords gateway server
     * @param client - pass parent class as parameter to modify accessible vars and pass events through
     */
    function ClientConnection(client) {
        this.GatewaySequence = 0;
        this.GatewayPings = [];
        this.GatewayPing = 0;
        this.GatewaySessionId = '';
        this.GatewayHeartbeatInterval = 0;
        this.GatewayProtocolVersion = 6;
        this.resuming = false;
        this.Client = client;
        this.ExpectedClosure = false;
        this.dispatcher = new ClientDispatcher_1.default(client, this);
        this.connector = new ClientConnectFlow_1.default(client, this, client.token);
    }
    /**
     * Connect to discord gateway
     * @param LocalGatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
     * @returns GatewayWebsocket - Websocket connection
     */
    ClientConnection.prototype.Connect = function (LocalGatewayURL) {
        this.Client.logger.write().debug({
            message: 'Creating New Gateway Connection',
            service: 'ClientConnection.Connect',
        });
        if (LocalGatewayURL) {
            // LocalGatewayURL is not required when reconnecting, we use cached version
            // Additional Gateway URL Parameters as defined https://discordapp.com/developers/docs/topics/gateway#connecting-gateway-url-params
            this.GatewayURL =
                LocalGatewayURL + '/?v=6&encoding=json';
        }
        if (this.GatewayURL) {
            this.Client.logger.write().debug({
                message: this.GatewayURL,
                service: 'ClientConnection.Connect',
            });
            this.GatewayWebsocket = new WebSocket(this.GatewayURL);
            // Handle websocket events
            this.GatewayWebsocket.once('open', this.GatewayOpen.bind(this));
            this.GatewayWebsocket.once('close', this.GatewayClose.bind(this));
            this.GatewayWebsocket.once('error', this.GatewayError.bind(this));
            this.GatewayWebsocket.on('message', this.GatewayMessage.bind(this));
            return true;
        }
        else {
            this.Client.logger.write().error({
                message: "Couldn't find a valid gateway url",
                service: 'ClientConnection.Connect',
            });
            return false;
        }
    };
    /**
     * Disconnect from the discord gateway
     */
    ClientConnection.prototype.Disconnect = function () {
        if (this.GatewayWebsocket) {
            this.ExpectedClosure = true;
            clearInterval(this.GatewayHeartbeat);
            this.GatewayWebsocket.close();
            return true;
        }
        else {
            this.Client.logger.write().error({
                message: new Error("Can't close a connection that isn't available"),
                service: 'ClientConnection.Disconnect',
            });
            return false;
        }
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
            this.Client.logger.write().debug({
                message: 'Successfully Sent A Message To Discord Gateway Server With OpCode: ' + op,
                service: 'ClientConnection.send',
            });
            return true;
        }
        else {
            this.Client.logger.write().warn({
                details: GatewayPackage,
                message: "Couldn't Send A Message To Discord Gateway Server: Socket Not Open",
                service: 'ClientConnection.send',
            });
            return false;
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
        this.send(gateway_1.default.STATUS_UPDATE, DataMessage);
    };
    ClientConnection.prototype.JoinVoiceChannel = function (GuildId, VoiceChannelId, mute, deaf) {
        if (mute === void 0) { mute = false; }
        if (deaf === void 0) { deaf = false; }
        var VoiceJoinPackage = {
            channel_id: VoiceChannelId,
            guild_id: GuildId,
            self_deaf: deaf,
            self_mute: mute,
        };
        this.send(gateway_1.default.VOICE_STATE_UPDATE, VoiceJoinPackage);
    };
    ClientConnection.prototype.LeaveVoiceChannel = function (GuildId) {
        var VoiceLeavePackage = {
            channel_id: null,
            guild_id: GuildId,
            self_deaf: false,
            self_mute: false,
        };
        this.send(gateway_1.default.VOICE_STATE_UPDATE, VoiceLeavePackage);
    };
    ClientConnection.prototype.CanUseCompression = function () {
        return !!zlib.inflateSync;
    };
    /**
     * Handles GatewayWebsocket `error` event
     */
    ClientConnection.prototype.GatewayError = function (error) {
        this.Client.logger.write().error({
            message: error,
            service: 'ClientConnection.GatewayWebsocket.GatewayError',
        });
    };
    /**
     * Handles GatewayWebsocket `close` event
     */
    ClientConnection.prototype.GatewayClose = function (code) {
        var _this = this;
        if (code !== 4011 && !this.ExpectedClosure) {
            this.Client.logger.write().warn({
                message: 'Connection to Gateway Server was Closed With Code: ' +
                    code +
                    '; ' +
                    (code ? (gatewayerrorcodes_1.default[code] ? gatewayerrorcodes_1.default[code] : 'Unknown') : 'Unknown'),
                service: 'ClientConnection.GatewayWebsocket.GatewayClose',
            });
            this.Client.logger.write().info({
                message: 'Attempting to Reestablish Connection to Gateway Server',
                service: 'ClientConnection.GatewayWebsocket.GatewayClose',
            });
            // Attempt to resume the connection after 5 seconds
            clearInterval(this.GatewayHeartbeat);
            setTimeout(function () {
                _this.resuming = true;
                _this.Connect();
            }, 5000);
        }
        else if (this.ExpectedClosure) {
            this.Client.logger.write().info({
                message: 'Gateway Connection Successfully Closed',
                service: 'ClientConnection.GatewayWebsocket.GatewayClose',
            });
        }
        else {
            // Sharding required
        }
    };
    /**
     * Handles GatewayWebsocket `open` event
     */
    ClientConnection.prototype.GatewayOpen = function () {
        this.Client.logger.write().info({
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
                // In the event that the server sends a heartbeat request, send heartbeat
                this.connector.SendHeartbeat();
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
                        _this.Connect();
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
                    this.Client.logger.write().error({
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
                this.Client.logger.write().warn({
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
//# sourceMappingURL=ClientConnection.js.map