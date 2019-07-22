"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChannelsMethods = /** @class */ (function () {
    function ChannelsMethods(r) {
        this.Requester = r;
    }
    ChannelsMethods.prototype.CreateMessage = function (Content, ChannelId) {
        this.Requester.SendRequest('POST', '/channels/' + ChannelId + '/messages', {
            content: Content,
        });
    };
    return ChannelsMethods;
}());
exports.default = ChannelsMethods;
