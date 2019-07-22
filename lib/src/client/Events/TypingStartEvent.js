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
var TypingStartEvent = /** @class */ (function (_super) {
    __extends(TypingStartEvent, _super);
    function TypingStartEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'TYPING_START';
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles TYPING_START event
     */
    TypingStartEvent.prototype.Handle = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchTextChannel(_this.Message.channel_id).then(function (AffectedChannel) {
                    var AffectedUser = AffectedGuild.Members.Get(_this.Message.user_id);
                    _this.EventChannelObject = AffectedChannel;
                    _this.EventUserObject = AffectedUser;
                    _this.EventTimestampObject = _this.Message.timestamp;
                    _this.EventGuildObject = AffectedGuild;
                    _super.prototype.Handle.call(_this);
                });
            });
        }
        else {
            // DM
            this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(function (AffectedChannel) {
                var AffectedUser = AffectedChannel.Recipients.Get(_this.Message.user_id);
                _this.EventChannelObject = AffectedChannel;
                _this.EventUserObject = AffectedUser;
                _this.EventTimestampObject = _this.Message.timestamp;
                _super.prototype.Handle.call(_this);
            });
        }
    };
    TypingStartEvent.prototype.EmitEvent = function () {
        if (this.EventChannelObject && this.EventUserObject && this.EventTimestampObject) {
            this.Client.emit(this.EventName, this.EventChannelObject, this.EventUserObject, this.EventTimestampObject, this.EventGuildObject);
        }
    };
    return TypingStartEvent;
}(ClientDispatcherEvent_1.default));
exports.default = TypingStartEvent;
