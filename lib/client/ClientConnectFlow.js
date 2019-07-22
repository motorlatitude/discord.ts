"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var gateway_1 = require("../common/constants/gateway");
var ClientConnectFlow = /** @class */ (function () {
    function ClientConnectFlow(client, cc, token) {
        this.GatewayHeartbeatSendTimestamp = 0;
        this.GatewayTotalPings = 0;
        this.Client = client;
        this.Connection = cc;
        this.Token = token;
    }
    /**
     * Start Connection Flow Once Hello Payload Received From Discord
     * @param HelloPackage - the hello package with opcode 10
     */
    ClientConnectFlow.prototype.Start = function (HelloPackage) {
        var _this = this;
        this.Client.logger.write().debug({
            message: 'Received Hello Payload',
            service: 'ClientConnection.ClientConnectFlow.Start',
        });
        this.Connection.resuming = false;
        this.Connection.GatewayHeartbeatInterval = HelloPackage.heartbeat_interval;
        // @ts-ignore
        this.Connection.GatewayHeartbeat = setInterval(function () {
            _this.SendHeartbeat();
        }, HelloPackage.heartbeat_interval);
        this.Client.logger.write().debug({
            message: 'Send Identify Payload',
            service: 'ClientConnection.ClientConnectFlow.Start',
        });
        this.SendIdentifyPayload();
    };
    ClientConnectFlow.prototype.SendHeartbeat = function () {
        this.GatewayHeartbeatSendTimestamp = new Date().getTime();
        this.Connection.send(gateway_1.default.HEARTBEAT, this.Connection.GatewaySequence);
    };
    /**
     * Sent Heartbeat has been acknowledged and returned
     */
    ClientConnectFlow.prototype.HeartbeatAcknowledged = function () {
        var ping = new Date().getTime() - this.GatewayHeartbeatSendTimestamp;
        this.Connection.GatewayPings.push(ping);
        this.GatewayTotalPings += ping;
        this.Connection.GatewayPing = this.GatewayTotalPings / this.Connection.GatewayPings.length;
        this.Client.logger.write().debug({
            message: 'Heartbeat acknowledged with sequence: ' +
                this.Connection.GatewaySequence +
                ' (' +
                ping +
                'ms - avergae: ' +
                Math.round(this.Connection.GatewayPing * 100) / 100 +
                'ms)',
            service: 'ClientConnection.ClientConnectFlow.HeartbeatAcknowledged',
        });
    };
    /**
     * Attempt to reconnect to discord gateway server by resuming the connection
     */
    ClientConnectFlow.prototype.Reconnect = function () {
        var _this = this;
        this.Client.logger.write().debug({
            message: 'Trying To Reconnect, Sending Resume Payload',
            service: 'ClientConnection.ClientConnectFlow.Reconnect',
        });
        // @ts-ignore
        this.Connection.GatewayHeartbeat = setInterval(function () {
            _this.SendHeartbeat();
        }, this.Connection.GatewayHeartbeatInterval);
        this.Connection.send(gateway_1.default.RESUME, {
            seq: this.Connection.GatewaySequence,
            session_id: this.Connection.GatewaySessionId,
            token: this.Token,
        });
    };
    /**
     * Sends Identify package to Discord Gateway Websocket server
     */
    ClientConnectFlow.prototype.SendIdentifyPayload = function () {
        var useCompression = this.Connection.CanUseCompression();
        this.Client.logger.write().debug({
            message: 'Can Use Compression: ' + useCompression,
            service: 'ClientConnection.ClientConnectFlow.SendIdentifyPayload',
        });
        this.Connection.send(gateway_1.default.IDENTIFY, {
            compress: useCompression,
            large_threshold: 250,
            presence: {
                afk: false,
                game: {
                    name: 'Identifying',
                    type: 0,
                },
                since: new Date().getTime(),
                status: 'dnd',
            },
            properties: {
                $browser: 'Discord.ts',
                $device: 'Server',
                $os: os.platform(),
            },
            token: this.Token,
        });
    };
    return ClientConnectFlow;
}());
exports.default = ClientConnectFlow;
//# sourceMappingURL=ClientConnectFlow.js.map