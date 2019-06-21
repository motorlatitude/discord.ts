"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../User/User");
var GuildMember = /** @class */ (function () {
    function GuildMember(GuildMemberObject) {
        this.User = GuildMember.ResolveUser(GuildMemberObject.user);
        this.Roles = GuildMemberObject.roles;
        this.JoinedAt = GuildMemberObject.joined_at;
        this.Deaf = GuildMemberObject.deaf;
        this.Mute = GuildMemberObject.mute;
        this.PremiumSince = GuildMemberObject.premium_since;
        this.Nick = GuildMemberObject.nick;
    }
    GuildMember.ResolveUser = function (UserObject) {
        return new User_1.default(UserObject);
    };
    GuildMember.prototype.Resolve = function () {
        return {
            deaf: this.Deaf,
            joined_at: this.JoinedAt,
            mute: this.Mute,
            nick: this.Nick,
            premium_since: this.PremiumSince,
            roles: this.Roles,
            user: this.User.Resolve(),
        };
    };
    return GuildMember;
}());
exports.default = GuildMember;
