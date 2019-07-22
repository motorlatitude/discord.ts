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
var Emoji_1 = require("../../resources/Guild/Emoji");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildEmojisUpdateEvent = /** @class */ (function (_super) {
    __extends(GuildEmojisUpdateEvent, _super);
    function GuildEmojisUpdateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'GUILD_EMOJIS_UPDATE';
        _this.Message = msg;
        return _this;
    }
    GuildEmojisUpdateEvent.prototype.Handle = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
            var emojis = [];
            for (var _i = 0, _a = _this.Message.emojis; _i < _a.length; _i++) {
                var emoji = _a[_i];
                var e = new Emoji_1.default(emoji);
                emojis.push(e);
                AffectedGuild.Emojis.ReplaceEmoji(emoji.id, e);
            }
            _this.EventGuildObject = AffectedGuild;
            _this.EventEmojisObject = emojis;
        });
        _super.prototype.Handle.call(this);
    };
    GuildEmojisUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventName && this.EventGuildObject && this.EventEmojisObject) {
            this.Client.emit(this.EventName, this.EventGuildObject, this.EventEmojisObject);
        }
    };
    return GuildEmojisUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildEmojisUpdateEvent;
