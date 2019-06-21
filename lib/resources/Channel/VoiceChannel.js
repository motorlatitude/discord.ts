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
var Channel_1 = require("./Channel");
var VoiceChannel = /** @class */ (function (_super) {
    __extends(VoiceChannel, _super);
    function VoiceChannel(Client, ChannelObject) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        _this.GuildId = ChannelObject.guild_id;
        _this.Position = ChannelObject.position;
        _this.PermissionOverwrites = ChannelObject.permission_overwrites;
        _this.Name = ChannelObject.name;
        _this.Bitrate = ChannelObject.bitrate;
        _this.UserLimit = ChannelObject.user_limit;
        return _this;
    }
    return VoiceChannel;
}(Channel_1.default));
exports.default = VoiceChannel;
