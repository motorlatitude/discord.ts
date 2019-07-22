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
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var VoiceServerUpdateEvent = /** @class */ (function (_super) {
    __extends(VoiceServerUpdateEvent, _super);
    function VoiceServerUpdateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'VOICE_SERVER_UPDATE';
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles VOICE_SERVER_UPDATE
     * This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.
     */
    VoiceServerUpdateEvent.prototype.Handle = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
            _this.Client.logger.write().info({
                message: 'A Server Update Event Occurred with these details; token: ' +
                    _this.Message.token +
                    ', endpoint: ' +
                    _this.Message.endpoint,
                service: 'ClientDispatcher.Events.VoiceServerUpdate.Handle',
            });
            AffectedGuild.CreateVoiceConnection(_this.Message.token, _this.Message.endpoint)
                .then(function (NewVoiceManager) {
                _this.EventObject = NewVoiceManager;
                _super.prototype.Handle.call(_this);
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.VoiceServerUpdate.Handle',
                });
                // Failed to establish new voice connection, either we don't have a user or session_id has not be received yet
                AffectedGuild.PendingVoiceConnection = true;
                AffectedGuild.PendingVoiceServerDetails = _this.Message;
                // Wait for voice state update for 5 seconds and then delete data
                setTimeout(function () {
                    AffectedGuild.PendingVoiceConnection = false;
                    delete AffectedGuild.PendingVoiceServerDetails;
                }, 5000);
            });
        });
    };
    /**
     * Handles delayed VOICE_STATE_UPDATE
     */
    VoiceServerUpdateEvent.prototype.HandlePendingVoiceConnection = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
            _this.Client.logger.write().info({
                message: 'A Delayed Server Update Event Occurred with these details; token: ' +
                    _this.Message.token +
                    ', endpoint: ' +
                    _this.Message.endpoint,
                service: 'ClientDispatcher.Events.VoiceServerUpdate.HandlePendingVoiceConnection',
            });
            AffectedGuild.CreateVoiceConnection(_this.Message.token, _this.Message.endpoint)
                .then(function (NewVoiceManager) {
                _this.EventObject = NewVoiceManager;
                _super.prototype.Handle.call(_this);
            })
                .catch(function (err) {
                // Complete failure
                _this.Client.logger.write().error({
                    message: err,
                    service: 'ClientDispatcher.Events.VoiceServerUpdate.HandlePendingVoiceConnection',
                });
            });
        });
    };
    VoiceServerUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventObject) {
            this.Client.emit(this.EventName, this.EventObject);
        }
    };
    return VoiceServerUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = VoiceServerUpdateEvent;
//# sourceMappingURL=VoiceServerUpdateEvent.js.map