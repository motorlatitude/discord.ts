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
var User_1 = require("../../resources/User/User");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildBanEvent = /** @class */ (function (_super) {
    __extends(GuildBanEvent, _super);
    function GuildBanEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.Message = msg;
        return _this;
    }
    /**
     * Sent when a user is banned from a guild
     */
    GuildBanEvent.prototype.HandleBanAdd = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Client.Guilds.Fetch(_this.Message.guild_id)
                .then(function (AffectedGuild) {
                _this.EventName = 'GUILD_BAN_ADD';
                AffectedGuild.Members.RemoveGuildMember(_this.Message.user.id); // We don't store the ban, bans must be fetched separately through rest
                _this.EventGuildObject = AffectedGuild;
                _this.EventUserObject = new User_1.default(_this.Message.user);
                _this.Handle();
                resolve({
                    Guild: _this.EventGuildObject,
                    User: _this.EventUserObject,
                });
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Sent when a banned user is unbanned from the guild
     */
    GuildBanEvent.prototype.HandleBanRemove = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Client.Guilds.Fetch(_this.Message.guild_id)
                .then(function (AffectedGuild) {
                _this.EventName = 'GUILD_BAN_REMOVE';
                _this.EventGuildObject = AffectedGuild;
                _this.EventUserObject = new User_1.default(_this.Message.user);
                _this.Handle();
                resolve({
                    Guild: _this.EventGuildObject,
                    User: _this.EventUserObject,
                });
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    GuildBanEvent.prototype.EmitEvent = function () {
        if (this.EventName && this.EventGuildObject && this.EventUserObject) {
            this.Client.emit(this.EventName, this.EventGuildObject, this.EventUserObject);
        }
    };
    return GuildBanEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildBanEvent;
//# sourceMappingURL=GuildBanEvent.js.map