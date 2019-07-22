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
var UserUpdateEvent = /** @class */ (function (_super) {
    __extends(UserUpdateEvent, _super);
    function UserUpdateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'USER_UPDATE';
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles USER_UPDATE event
     * Sent when properties about the current bot user change
     */
    UserUpdateEvent.prototype.Handle = function () {
        var NewUser = new User_1.default(this.Message);
        this.Client.User = NewUser;
        this.EventUserObject = NewUser;
        _super.prototype.Handle.call(this);
    };
    UserUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventUserObject) {
            this.Client.emit(this.EventName, this.EventUserObject);
        }
    };
    return UserUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = UserUpdateEvent;
