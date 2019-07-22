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
var Datagram = require("dgram");
var events_1 = require("events");
var nacl = require("tweetnacl");
/**
 * Handles connection to discord voice UDP server
 */
var VoiceUDPClient = /** @class */ (function (_super) {
    __extends(VoiceUDPClient, _super);
    function VoiceUDPClient(client, vc) {
        var _this = _super.call(this) || this;
        _this.Client = client;
        _this.VoiceConnection = vc;
        _this.ReadyState = false;
        _this.IPDiscoveryDone = false;
        return _this;
    }
    VoiceUDPClient.prototype.Connect = function (Port, Address) {
        this.UDPConnection = Datagram.createSocket('udp4');
        this.UDPConnection.on('listening', this.DatagramSocketListening.bind(this));
        this.UDPConnection.on('error', this.DatagramSocketError.bind(this));
        this.UDPConnection.on('close', this.DatagramSocketClose.bind(this));
        this.UDPConnection.on('connect', this.DatagramSocketConnect.bind(this));
        this.UDPConnection.on('message', this.DatagramSocketMessage.bind(this));
        this.UDPConnection.connect(Port, Address); // Requires NodeJS v12.0.0
    };
    VoiceUDPClient.prototype.GetLocalInformation = function (ssrc) {
        this.Client.logger.write().info({
            message: 'Starting IP Discovery',
            service: 'VoiceConnection.VoiceUDPClient.GetLocalInformation',
        });
        var InitPackage = Buffer.alloc(70);
        InitPackage.writeUIntBE(ssrc, 0, 4);
        this.Send(InitPackage, 0, InitPackage.length);
    };
    VoiceUDPClient.prototype.SendAudioPacket = function (Data) {
        if (this.VoiceConnection.SSRC) {
            var mac = this.SecretKey ? 16 : 0;
            var PackageLength = Data.length + 12 + mac;
            var AudioBuffer_1 = Data;
            var EncryptedBuffer = Buffer.alloc(PackageLength, 0);
            EncryptedBuffer[0] = 0x80;
            EncryptedBuffer[1] = 0x78;
            EncryptedBuffer.writeUIntBE(this.VoiceConnection.Sequence, 2, 2);
            EncryptedBuffer.writeUIntBE(this.VoiceConnection.Timestamp, 4, 4);
            EncryptedBuffer.writeUIntBE(this.VoiceConnection.SSRC, 8, 4);
            if (this.SecretKey) {
                var nonce = Buffer.alloc(24, 0);
                EncryptedBuffer.copy(nonce, 0, 0, 12);
                AudioBuffer_1 = nacl.secretbox(new Uint8Array(Data), new Uint8Array(nonce), new Uint8Array(this.SecretKey));
            }
            for (var i = 0; i < AudioBuffer_1.length; i++) {
                EncryptedBuffer[i + 12] = AudioBuffer_1[i];
            }
            this.Send(EncryptedBuffer, 0, EncryptedBuffer.length);
        }
    };
    VoiceUDPClient.prototype.Send = function (Message, Offset, Length) {
        if (this.ReadyState) {
            this.UDPConnection.send(Message, Offset, Length);
        }
    };
    VoiceUDPClient.prototype.DatagramSocketConnect = function () {
        this.Client.logger.write().debug({
            message: 'Voice UDP Client has successfully connected',
            service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketError',
        });
        this.ReadyState = true;
        this.emit('READY');
    };
    VoiceUDPClient.prototype.DatagramSocketError = function (err) {
        this.ReadyState = false;
        this.Client.logger.write().error({
            message: err,
            service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketError',
        });
    };
    VoiceUDPClient.prototype.DatagramSocketClose = function () {
        this.ReadyState = false;
        this.Client.logger.write().warn({
            message: 'Voice UDP Client Connection was Closed',
            service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketClose',
        });
    };
    VoiceUDPClient.prototype.DatagramSocketListening = function () {
        if (this.UDPConnection) {
            var address = this.UDPConnection.address();
            this.Client.logger.write().info({
                message: 'Voice UDP Client is listening on ' + address.address + ':' + address.port,
                service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketListening',
            });
        }
    };
    VoiceUDPClient.prototype.DatagramSocketMessage = function (Message) {
        if (this.IPDiscoveryDone) {
            // Handle packets maybe?
        }
        else {
            var LocalIP = '';
            var LocalPort = parseInt(Message.readUIntLE(Message.length - 2, 2).toString(10), 10);
            var Packet = Buffer.from(Message);
            for (var i = 4; i < Packet.indexOf(0, i); i++) {
                LocalIP += String.fromCharCode(Packet[i]);
            }
            this.Client.logger.write().info({
                message: 'IP Discovery Done - ' + LocalIP + ':' + LocalPort,
                service: 'VoiceConnection.VoiceUDPClient.DatagramSocketMessage',
            });
            this.emit('IP_DISCOVERY_DONE', LocalIP, LocalPort);
            this.IPDiscoveryDone = true;
        }
    };
    return VoiceUDPClient;
}(events_1.EventEmitter));
exports.default = VoiceUDPClient;
//# sourceMappingURL=VoiceUDPClient.js.map