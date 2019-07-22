"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var voiceendpoint_1 = require("./../common/constants/voiceendpoint");
var VoiceConnectFlow = /** @class */ (function () {
    function VoiceConnectFlow(client, voiceConnection) {
        this.VoiceConnection = voiceConnection;
        this.Client = client;
        this.VoicePings = [];
        this.TotalVoicePings = 0;
    }
    /**
     * Start the Voice Connection Flow
     * 1.
     * Identify ->
     *    Ready <-
     * 2.
     * ConnectToUDP ->
     * IP Discovery <-
     * 3.
     *     SelectProtocol ->
     * SessionDescription <-
     */
    VoiceConnectFlow.prototype.Start = function () {
        if (this.Client.User) {
            var IdentifyPackage = {
                server_id: this.VoiceConnection.Guild.id,
                session_id: this.VoiceConnection.SessionId,
                token: this.VoiceConnection.Token,
                user_id: this.Client.User.id,
            };
            // Send Identify Package; OpCode 0
            // https://discordapp.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection-example-voice-identify-payload
            this.VoiceConnection.Send(voiceendpoint_1.default.IDENTIFY, IdentifyPackage);
        }
    };
    /**
     * Handles Voice Endpoint Ready OpCode
     */
    VoiceConnectFlow.prototype.Ready = function (Message) {
        this.VoiceConnection.SetSSRC(Message.ssrc);
        this.VoiceConnection.SetIPAndPort(Message.ip, Message.port);
        this.VoiceConnection.SetModes(Message.modes);
        this.ConnectToUDP(Message.ip, Message.port, Message.ssrc);
    };
    /**
     * Initiate UDP Connection
     * @param IPAddress - Discords IP Address
     * @param Port - Discords Port
     * @param SSRC - The ssrc
     */
    VoiceConnectFlow.prototype.ConnectToUDP = function (IPAddress, Port, SSRC) {
        var _this = this;
        this.VoiceConnection.UDPClient.on('READY', function () {
            if (_this.VoiceConnection.UDPClient && SSRC) {
                // Start IP Discovery Process
                _this.VoiceConnection.UDPClient.GetLocalInformation(SSRC);
            }
        });
        this.VoiceConnection.UDPClient.on('IP_DISCOVERY_DONE', function (LocalIPAddress, LocalPort) {
            _this.VoiceConnection.SetLocalIPAndPort(LocalIPAddress, LocalPort);
            _this.SelectProtocol(LocalIPAddress, LocalPort);
        });
        this.VoiceConnection.UDPClient.Connect(Port, IPAddress);
    };
    /**
     * Let Discord know our IP Address and Port and start receiving data
     * @param LocalIPAddress - Our External IP Address
     * @param LocalPort - Our External UDP Port
     */
    VoiceConnectFlow.prototype.SelectProtocol = function (LocalIPAddress, LocalPort) {
        this.VoiceConnection.Send(voiceendpoint_1.default.SELECT_PROTOCOL, {
            data: {
                address: LocalIPAddress,
                mode: 'xsalsa20_poly1305',
                port: LocalPort,
            },
            protocol: 'udp',
        });
    };
    /**
     * Handles Incoming Session Description
     * @param Message - OpCode 4 Session Description package
     */
    VoiceConnectFlow.prototype.SessionDescription = function (Message) {
        if (Message.mode === 'xsalsa20_poly1305') {
            this.VoiceConnection.UDPClient.SecretKey = Message.secret_key;
            // we're ready to send voice data now
            this.VoiceConnection.VoiceReady = true;
            this.VoiceConnection.emit('VOICE_READY');
        }
        else {
            this.Client.logger.write().warn({
                message: 'Unsupported Voice Mode',
                service: 'VoiceConnection.VoiceConnectFlow.SessionDescription',
            });
        }
    };
    /**
     * Handles HEARTBEAT_ACK - OpCode 6
     * @param Message - Timestamp Nonce
     */
    VoiceConnectFlow.prototype.HeartbeatAcknowledgement = function (Message) {
        if (this.LastSentHeartbeat) {
            if (this.LastSentHeartbeat === Message) {
                var VoicePing = new Date().getTime() - this.LastSentHeartbeat;
                this.VoicePings.push(VoicePing);
                this.TotalVoicePings += VoicePing;
                var AverageVoicePing = Math.round((this.TotalVoicePings / this.VoicePings.length) * 100) / 100;
                this.Client.logger.write().debug({
                    message: 'Acknowledged Voice Heartbeat (' + VoicePing + 'ms - average: ' + AverageVoicePing + 'ms)',
                    service: 'VoiceConnection.VoiceConnectFlow.HeartbeatAcknowledgement',
                });
                this.ReceivedAcknowledgement = true;
            }
            else {
                this.Client.logger.write().warn({
                    message: 'Heartbeat Acknowledge package nonce mismatch',
                    service: 'VoiceConnection.VoiceConnectFlow.HeartbeatAcknowledgement',
                });
            }
        }
    };
    /**
     * Handles Hello
     */
    VoiceConnectFlow.prototype.Hello = function (Message) {
        var _this = this;
        this.VoiceHeartbeatInterval = Message.heartbeat_interval * 0.75; // WARN - bug in discords Hello payload interval
        // Start Heartbeat
        // @ts-ignore
        this.VoiceHeartbeat = setInterval(function () {
            _this.Heartbeat();
        }, this.VoiceHeartbeatInterval);
    };
    VoiceConnectFlow.prototype.Heartbeat = function () {
        if (this.ReceivedAcknowledgement || this.ReceivedAcknowledgement === undefined) {
            this.LastSentHeartbeat = new Date().getTime();
            this.ReceivedAcknowledgement = false;
            this.VoiceConnection.Send(voiceendpoint_1.default.HEARTBEAT, this.LastSentHeartbeat);
        }
        else {
            this.Client.logger.write().warn({
                message: 'Voice endpoint took too long to respond to heartbeat',
                service: 'VoiceConnection.VoiceConnectFlow.Heartbeat',
            });
        }
    };
    return VoiceConnectFlow;
}());
exports.default = VoiceConnectFlow;
