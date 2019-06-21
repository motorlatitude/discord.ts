"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NPM Modules
// Others
var DiscordMethods_1 = require("./DiscordMethods");
var DiscordRequester_1 = require("./DiscordRequester");
var DiscordManager = /** @class */ (function () {
    function DiscordManager(token) {
        this.Requester = new DiscordRequester_1.default(token);
    }
    DiscordManager.prototype.Methods = function () {
        return new DiscordMethods_1.default(this.Requester);
    };
    return DiscordManager;
}());
exports.default = DiscordManager;
