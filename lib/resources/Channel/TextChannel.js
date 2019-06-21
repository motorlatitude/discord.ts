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
var MessageStore_1 = require("../../stores/MessageStore");
var Channel_1 = require("./Channel");
var TextChannel = /** @class */ (function (_super) {
    __extends(TextChannel, _super);
    function TextChannel(Client, ChannelObject) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        _this.GuildId = ChannelObject.guild_id;
        _this.Position = ChannelObject.position;
        _this.PermissionOverwrites = ChannelObject.permission_overwrites; // TODO
        _this.Name = ChannelObject.name;
        _this.Topic = ChannelObject.topic;
        _this.NSFW = ChannelObject.nsfw;
        _this.Messages = new MessageStore_1.default(Client);
        _this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
        _this.RateLimitPerUser = ChannelObject.rate_limit_per_user ? ChannelObject.rate_limit_per_user : undefined;
        _this.ParentId = ChannelObject.parent_id ? ChannelObject.parent_id : undefined;
        _this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
        return _this;
    }
    return TextChannel;
}(Channel_1.default));
exports.default = TextChannel;
