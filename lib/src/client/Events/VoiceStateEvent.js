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
var VoiceState_1 = require("../../resources/Voice/VoiceState");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var VoiceServerUpdateEvent_1 = require("./VoiceServerUpdateEvent");
var VoiceStateEvent = /** @class */ (function (_super) {
    __extends(VoiceStateEvent, _super);
    function VoiceStateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'VOICE_STATE_UPDATE';
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles VOICE_STATE_UPDATE
     * Sent when someone joins/leaves/moves voice channels.
     */
    VoiceStateEvent.prototype.Handle = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
                if (_this.Message.channel_id) {
                    // Either user is joining or they're updating their state
                    var OldVoiceState = AffectedGuild.VoiceStates.Get(_this.Message.user_id);
                    var NewVoiceState = new VoiceState_1.default(_this.Client, _this.Message);
                    AffectedGuild.VoiceStates.UpdateVoiceState(_this.Message.user_id, NewVoiceState);
                    if (OldVoiceState) {
                        _this.EventType = 'UPDATED';
                    }
                    else {
                        _this.EventType = 'JOINED';
                    }
                    if (AffectedGuild.PendingVoiceConnection && AffectedGuild.PendingVoiceServerDetails) {
                        var voiceServerUpdateEvent = new VoiceServerUpdateEvent_1.default(_this.Client, AffectedGuild.PendingVoiceServerDetails);
                        voiceServerUpdateEvent.HandlePendingVoiceConnection();
                    }
                    _this.EventObject = NewVoiceState;
                    _super.prototype.Handle.call(_this);
                }
                else {
                    // User has left the channel
                    var OldVoiceState = AffectedGuild.VoiceStates.Get(_this.Message.user_id);
                    AffectedGuild.VoiceStates.RemoveVoiceState(_this.Message.user_id);
                    _this.EventType = 'LEFT';
                    _this.EventObject = OldVoiceState;
                    _super.prototype.Handle.call(_this);
                }
            });
        }
        else {
            // DM
            if (this.Message.channel_id) {
                // Either user is joining or they're updating their state
                var OldVoiceState = this.Client.VoiceStates.Get(this.Message.user_id);
                var NewVoiceState = new VoiceState_1.default(this.Client, this.Message);
                this.Client.VoiceStates.UpdateVoiceState(this.Message.user_id, NewVoiceState);
                if (OldVoiceState) {
                    this.EventType = 'UPDATED';
                }
                else {
                    this.EventType = 'JOINED';
                }
                this.EventObject = NewVoiceState;
                _super.prototype.Handle.call(this);
            }
            else {
                // User has left the channel
                var OldVoiceState = this.Client.VoiceStates.Get(this.Message.user_id);
                this.Client.VoiceStates.RemoveVoiceState(this.Message.user_id);
                this.EventType = 'LEFT';
                this.EventObject = OldVoiceState;
                _super.prototype.Handle.call(this);
            }
        }
    };
    VoiceStateEvent.prototype.EmitEvent = function () {
        if (this.EventType && this.EventObject) {
            this.Client.emit(this.EventName, this.EventType, this.EventObject);
        }
    };
    return VoiceStateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = VoiceStateEvent;
