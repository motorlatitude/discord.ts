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
var UserStore_1 = require("../../stores/UserStore");
var User_1 = require("../User/User");
var TextBasedChannel_1 = require("./TextBasedChannel");
var DirectMessageChannel = /** @class */ (function (_super) {
    __extends(DirectMessageChannel, _super);
    function DirectMessageChannel(Client, ChannelObject) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        _this.Recipients = new UserStore_1.default(Client);
        if (ChannelObject.recipients) {
            _this.ResolveRecipients(ChannelObject.recipients);
        }
        _this.Icon = ChannelObject.icon ? ChannelObject.icon : '';
        _this.OwnerId = ChannelObject.owner_id;
        return _this;
    }
    DirectMessageChannel.prototype.ResolveRecipients = function (Recipients) {
        for (var _i = 0, Recipients_1 = Recipients; _i < Recipients_1.length; _i++) {
            var user = Recipients_1[_i];
            this.Recipients.AddUser(new User_1.default(user));
        }
    };
    return DirectMessageChannel;
}(TextBasedChannel_1.default));
exports.default = DirectMessageChannel;
//# sourceMappingURL=DirectMessageChannel.js.map