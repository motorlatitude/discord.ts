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
var TextBasedChannel = /** @class */ (function (_super) {
    __extends(TextBasedChannel, _super);
    function TextBasedChannel(client, ChannelObject) {
        var _this = _super.call(this, client, ChannelObject) || this;
        _this.Name = ChannelObject.name || "";
        _this.Messages = new MessageStore_1.default(client);
        _this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
        _this.ApplicationId = ChannelObject.application_id ? ChannelObject.application_id : undefined;
        _this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
        return _this;
    }
    TextBasedChannel.prototype.SendMessage = function (Content, MessageDetails) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Client.DiscordAPIManager.Methods().ChannelMethods().CreateMessage(_this.id, Content, MessageDetails).then(function (Response) {
                resolve(Response.body);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    return TextBasedChannel;
}(Channel_1.default));
exports.default = TextBasedChannel;
//# sourceMappingURL=TextBasedChannel.js.map