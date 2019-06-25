"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Channel = /** @class */ (function () {
    function Channel(Client, ChannelObject) {
        this.Client = Client;
        this.id = ChannelObject.id;
        this.type = ChannelObject.type;
    }
    return Channel;
}());
exports.default = Channel;
