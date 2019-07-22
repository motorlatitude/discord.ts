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
var ReadyEvent = /** @class */ (function (_super) {
    __extends(ReadyEvent, _super);
    function ReadyEvent(client, data) {
        var _this = _super.call(this, client) || this;
        _this.Message = data;
        return _this;
    }
    ReadyEvent.prototype.Handle = function () {
        this.StoreGatewayProtocolVersion(this.Message.v);
        this.StoreSessionId(this.Message.session_id);
        this.StoreUser(this.Message.user);
        this.EventObject = new User_1.default(this.Message.user);
        if (this.Client.Connection) {
            this.Client.Connection.SetStatus('', 2, 'online');
        }
        _super.prototype.Handle.call(this);
    };
    ReadyEvent.prototype.EmitEvent = function () {
        if (this.EventObject) {
            this.Client.emit('READY', this.EventObject);
        }
    };
    ReadyEvent.prototype.StoreGatewayProtocolVersion = function (ProtocolVersion) {
        if (this.Client.Connection) {
            this.Client.Connection.GatewayProtocolVersion = ProtocolVersion;
        }
    };
    ReadyEvent.prototype.StoreSessionId = function (SessionId) {
        if (this.Client.Connection) {
            this.Client.Connection.GatewaySessionId = SessionId;
        }
    };
    ReadyEvent.prototype.StoreUser = function (UserObject) {
        if (this.Client.Connection) {
            this.Client.User = new User_1.default(UserObject);
        }
    };
    return ReadyEvent;
}(ClientDispatcherEvent_1.default));
exports.default = ReadyEvent;
//# sourceMappingURL=ReadyEvent.js.map