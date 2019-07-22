"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var WebSocket = require("ws");
var zlib = require("zlib");
var voiceendpoint_1 = require("../common/constants/voiceendpoint");
var voiceerrorcodes_1 = require("../common/constants/voiceerrorcodes");
var VoiceConnectFlow_1 = require("./VoiceConnectFlow");
var VoiceUDPClient_1 = require("./VoiceUDPClient");
/**
 * Handles Connection With the Discord Voice WebSocket Server
 */
var VoiceConnection = /** @class */ (function (_super) {
    __extends(VoiceConnection, _super);
    /**
     * Initialise a new voice connection
     * @param client - the DiscordClient instance
     * @param guild - the Guild instance
     * @param token - Endpoint Token
     * @param endpoint - Endpoint URL
     * @param sessionId - The session id for the voice state
     * @constructor
     */
    function VoiceConnection(client, guild, token, endpoint, sessionId) {
        var _this = _super.call(this) || this;
        _this.Sequence = Math.round(Math.random() * 10);
        _this.Timestamp = Math.round(Math.random() * 1000);
        _this.Client = client;
        _this.Client.logger.write().debug({
            message: 'Creating a new VoiceConnection',
            service: 'DiscordClient.Guild.VoiceConnection',
        });
        _this.Token = token;
        _this.Endpoint = 'wss://' + endpoint.split(':')[0] + '?v=3'; // Set to version 3 (Recommended) https://discordapp.com/developers/docs/topics/voice-connections#voice-gateway-versioning-gateway-versions
        _this.SessionId = sessionId;
        _this.Guild = guild;
        _this.VoiceConnector = new VoiceConnectFlow_1.default(_this.Client, _this);
        _this.UDPClient = new VoiceUDPClient_1.default(_this.Client, _this);
        _this.Resuming = false;
        _this.ExpectedClosure = false;
        return _this;
    }
    /**
     * Connect To The Voice Endpoint
     */
    VoiceConnection.prototype.Connect = function () {
        this.Client.logger.write().debug({
            message: 'Connecting a VoiceConnection; ' + this.Endpoint,
            service: 'DiscordClient.Guild.VoiceConnection.Connect',
        });
        this.VoiceWebsocket = new WebSocket(this.Endpoint);
        // Handle voice websocket events
        this.VoiceWebsocket.once('open', this.VoiceWebsocketOpen.bind(this));
        this.VoiceWebsocket.once('close', this.VoiceWebsocketClose.bind(this));
        this.VoiceWebsocket.once('error', this.VoiceWebsocketError.bind(this));
        this.VoiceWebsocket.on('message', this.VoiceWebsocketMessage.bind(this));
    };
    /**
     * Gracefully Disconnect
     */
    VoiceConnection.prototype.Disconnect = function () {
        if (this.VoiceWebsocket) {
            this.ExpectedClosure = true;
            clearInterval(this.VoiceConnector.VoiceHeartbeat);
            if (this.VoiceWebsocket.readyState !== WebSocket.CLOSED && this.VoiceWebsocket.readyState !== WebSocket.CLOSING) {
                this.VoiceWebsocket.close();
            }
        }
    };
    /**
     * Send a message to the voice endpoint
     */
    VoiceConnection.prototype.Send = function (op, d) {
        var VoiceWebsocketPackage = {
            d: d,
            op: op,
        };
        if (this.VoiceWebsocket && this.VoiceWebsocket.readyState === WebSocket.OPEN) {
            this.VoiceWebsocket.send(JSON.stringify(VoiceWebsocketPackage));
            this.Client.logger.write().debug({
                message: 'Successfully Sent a Message to the Voice Endpoint With OpCode: ' + op,
                service: 'DiscordClient.Guild.VoiceConnection.send',
            });
        }
        else {
            this.Client.logger.write().warn({
                details: VoiceWebsocketPackage,
                message: "Couldn't Send a Message to the Voice Endpoint: Socket Not Open",
                service: 'DiscordClient.Guild.VoiceConnection.send',
            });
        }
    };
    /**
     * Set Speaking Mode
     * @param Speaking - Are we speaking; true or false, must be true BEFORE sending voice data
     */
    VoiceConnection.prototype.SetSpeaking = function (Speaking) {
        this.Send(voiceendpoint_1.default.SPEAKING, {
            delay: 0,
            speaking: Speaking,
            ssrc: this.SSRC,
        });
    };
    /**
     * Set the connection's ssrc
     * @param NewSSRC - The new ssrc number
     */
    VoiceConnection.prototype.SetSSRC = function (NewSSRC) {
        this.SSRC = NewSSRC;
        return this.SSRC;
    };
    /**
     * Set the connection's IP Address and Port number
     * @param IPAddress - The new IP Address
     * @param Port - The new Port number
     */
    VoiceConnection.prototype.SetIPAndPort = function (IPAddress, Port) {
        this.IPAddress = IPAddress;
        this.Port = Port;
        return this.IPAddress + ':' + this.Port;
    };
    /**
     * Set the connection's mode
     * @param Modes - an array of strings defining possible modes, usually ["plain", "xsalsa20_poly1305"] - plain is no longer supported
     */
    VoiceConnection.prototype.SetModes = function (Modes) {
        this.Modes = Modes;
        return this.Modes;
    };
    /**
     * Set Local IP Address and Port
     * @param LocalIPAddress - Our IP Address
     * @param LocalPort - Our UDP Port
     */
    VoiceConnection.prototype.SetLocalIPAndPort = function (LocalIPAddress, LocalPort) {
        this.LocalIPAddress = LocalIPAddress;
        this.LocalPort = LocalPort;
    };
    /**
     * Handles Voice Endpoint Error
     * @param err - The Error reason why the connection was closed
     */
    VoiceConnection.prototype.VoiceWebsocketError = function (err) {
        this.Client.logger.write().error({
            message: err,
            service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketError',
        });
    };
    /**
     * Handles Voice Endpoint Closure
     */
    VoiceConnection.prototype.VoiceWebsocketClose = function (code) {
        var _this = this;
        var StopVoiceCodes = [4001, 4003, 4004, 4005, 4006, 4009, 4011, 4012, 4016]; // These codes are reasons to stop voice and not retry
        if (code && StopVoiceCodes.indexOf(code) > -1) {
            // We screwed something up, expect closure
            this.ExpectedClosure = true;
            this.Disconnect();
            this.Client.logger.write().warn({
                message: 'Connection to the Voice Endpoint was Closed With Code: ' +
                    code +
                    '; ' +
                    (voiceerrorcodes_1.default[code] ? voiceerrorcodes_1.default[code] : ''),
                service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketClose',
            });
        }
        else if (code === 4014 || code === 4015 || !this.ExpectedClosure) {
            // Didn't expect to close, try resuming connection
            this.Resuming = true;
            this.Client.logger.write().info({
                message: 'Connection to the Voice Endpoint was Closed With Code: ' +
                    code +
                    '; ' +
                    (code && voiceerrorcodes_1.default[code] ? voiceerrorcodes_1.default[code] : '') +
                    ' - Trying to resume the connection',
                service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketClose',
            });
            // Wait a couple of seconds
            setTimeout(function () {
                _this.Connect();
            }, 2000);
        }
        else {
            this.Client.logger.write().info({
                message: 'Connection to the Voice Endpoint was Closed With Code: ' + code,
                service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketClose',
            });
        }
    };
    /**
     * Handles Voice Endpoint Opening
     */
    VoiceConnection.prototype.VoiceWebsocketOpen = function () {
        this.Client.logger.write().debug({
            message: 'Successfully Connected to Voice Endpoint',
            service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketOpen',
        });
        if (this.Resuming) {
            // Send Resume Package
            this.Send(voiceendpoint_1.default.RESUME, {
                server_id: this.Guild.id,
                session_id: this.SessionId,
                token: this.Token,
            });
        }
        else {
            // Start Full Connection Flow
            this.VoiceConnector.Start();
        }
    };
    /**
     * Handles Voice Endpoint Message
     * @param Message - Data in the message
     */
    VoiceConnection.prototype.VoiceWebsocketMessage = function (Message) {
        var data;
        if (typeof Message === 'string') {
            // message is json
            data = JSON.parse(Message);
        }
        else {
            // message is buffer
            // @ts-ignore
            var extractedData = zlib.inflateSync(Message).toString();
            data = JSON.parse(extractedData);
        }
        this.Client.logger.write().debug({
            message: 'Received a Message From the Voice Endpoint With OpCode: ' + data.op,
            service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketMessage',
        });
        // Handle available OpCodes: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-opcodes
        switch (data.op) {
            case voiceendpoint_1.default.READY: {
                this.VoiceConnector.Ready(data.d);
                break;
            }
            case voiceendpoint_1.default.HELLO: {
                this.VoiceConnector.Hello(data.d);
                break;
            }
            case voiceendpoint_1.default.SESSION_DESCRIPTION: {
                this.VoiceConnector.SessionDescription(data.d);
                break;
            }
            case voiceendpoint_1.default.HEARTBEAT_ACK: {
                this.VoiceConnector.HeartbeatAcknowledgement(data.d);
                break;
            }
            case voiceendpoint_1.default.SPEAKING: {
                // Someone is speaking
                break;
            }
            case voiceendpoint_1.default.RESUMED: {
                // Connection Successfully Resumed
                this.Client.logger.write().info({
                    message: 'Closed voice connection has been resumed',
                    service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketMessage',
                });
                break;
            }
            case voiceendpoint_1.default.CLIENT_DISCONNECT: {
                // A Client Has Disconnected From The Voice Channel
                break;
            }
            default: {
                this.Client.logger.write().warn({
                    message: 'Unhandled Voice Endpoint OpCode: ' + data.op,
                    service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketMessage',
                });
            }
        }
    };
    return VoiceConnection;
}(events_1.EventEmitter));
exports.default = VoiceConnection;
//# sourceMappingURL=VoiceConnection.js.map