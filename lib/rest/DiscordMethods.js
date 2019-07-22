"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuditMethods_1 = require("./Methods/AuditMethods");
var ChannelsMethods_1 = require("./Methods/ChannelsMethods");
var GatewayMethods_1 = require("./Methods/GatewayMethods");
var GuildMethods_1 = require("./Methods/GuildMethods");
var DiscordMethods = /** @class */ (function () {
    function DiscordMethods(r) {
        this.Requester = r;
    }
    DiscordMethods.prototype.GatewayMethods = function () {
        return new GatewayMethods_1.default(this.Requester);
    };
    DiscordMethods.prototype.ChannelMethods = function () {
        return new ChannelsMethods_1.default(this.Requester);
    };
    DiscordMethods.prototype.GuildMethods = function () {
        return new GuildMethods_1.default(this.Requester);
    };
    DiscordMethods.prototype.AuditMethods = function () {
        return new AuditMethods_1.default(this.Requester);
    };
    return DiscordMethods;
}());
exports.default = DiscordMethods;
//# sourceMappingURL=DiscordMethods.js.map