"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Node Modules
var os = require("os");
var ClientConnection_1 = require("./ClientConnection");
// Constants
var gateway_1 = require("../common/constants/gateway");
var ConnectFlow = /** @class */ (function () {
    function ConnectFlow(cc, log, token) {
        this.GatewayHeartbeatSendTimestamp = 0;
        this.GatewayTotalPings = 0;
        this.logger = log;
        this.connection = cc;
        this.token = token;
    }
    /**
     * Start Connection Flow Once Hello Payload Received From Discord
     * @param HelloPackage - the hello package with opcode 10
     */
    ConnectFlow.prototype.Start = function (HelloPackage) {
        var _this = this;
        this.logger.write().debug({
            message: 'Received Hello Payload',
            service: 'ClientConnection.ConnectFlow.Start',
        });
        this.connection.resuming = false;
        this.connection.GatewayHeartbeatInterval = HelloPackage.heartbeat_interval;
        // @ts-ignore
        this.connection.GatewayHeartbeat = setInterval(function () {
            _this.GatewayHeartbeatSendTimestamp = new Date().getTime();
            _this.connection.send(gateway_1.default.HEARTBEAT, _this.connection.GatewaySequence);
        }, HelloPackage.heartbeat_interval);
        this.logger.write().debug({
            message: 'Send Identify Payload',
            service: 'ClientConnection.ConnectFlow.Start',
        });
        this.SendIdentifyPayload();
    };
    /**
     * Sent Heartbeat has been acknowledged and returned
     */
    ConnectFlow.prototype.HeartbeatAcknowledged = function () {
        var ping = new Date().getTime() - this.GatewayHeartbeatSendTimestamp;
        this.connection.GatewayPings.push(ping);
        this.GatewayTotalPings += ping;
        this.connection.GatewayPing = this.GatewayTotalPings / this.connection.GatewayPings.length;
        this.logger.write().debug({
            message: 'Heartbeat acknowledged with sequence: ' +
                this.connection.GatewaySequence +
                '(' +
                ping +
                'ms - avergae: ' +
                Math.round(this.connection.GatewayPing * 100) / 100 +
                'ms)',
            service: 'ClientConnection.ConnectFlow.HeartbeatAcknowledged',
        });
    };
    /**
     * Attempt to reconnect to discord gateway server by resuming the connection
     */
    ConnectFlow.prototype.Reconnect = function () {
        this.logger.write().debug({
            message: 'Trying To Reconnect, Sending Resume Payload',
            service: 'ClientConnection.ConnectFlow.Reconnect',
        });
        this.connection.send(gateway_1.default.RESUME, {
            seq: this.connection.GatewaySequence,
            session_id: this.connection.GatewaySessionId,
            token: this.token,
        });
    };
    /**
     * Sends Identify package to Discord Gateway Websocket server
     */
    ConnectFlow.prototype.SendIdentifyPayload = function () {
        var useCompression = ClientConnection_1.default.CanUseCompression();
        this.logger.write().debug({
            message: 'Can Use Compression: ' + useCompression,
            service: 'ClientConnection.ConnectFlow.SendIdentifyPayload',
        });
        this.connection.send(gateway_1.default.IDENTIFY, {
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
            token: this.token,
        });
    };
    return ConnectFlow;
}());
exports.default = ConnectFlow;
