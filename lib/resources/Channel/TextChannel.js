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
var TextBasedChannel_1 = require("./TextBasedChannel");
var TextChannel = /** @class */ (function (_super) {
    __extends(TextChannel, _super);
    function TextChannel(Client, ChannelObject, guild) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        _this.Guild = guild;
        _this.GuildId = guild.id;
        _this.Position = ChannelObject.position;
        _this.PermissionOverwrites = ChannelObject.permission_overwrites; // TODO
        _this.Topic = ChannelObject.topic;
        _this.NSFW = ChannelObject.nsfw;
        _this.RateLimitPerUser = ChannelObject.rate_limit_per_user ? ChannelObject.rate_limit_per_user : undefined;
        _this.ParentId = ChannelObject.parent_id ? ChannelObject.parent_id : undefined;
        return _this;
    }
    return TextChannel;
}(TextBasedChannel_1.default));
exports.default = TextChannel;
//# sourceMappingURL=TextChannel.js.map