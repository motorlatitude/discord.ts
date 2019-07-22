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
var Store_1 = require("./Store");
var UserStore = /** @class */ (function (_super) {
    __extends(UserStore, _super);
    function UserStore(client) {
        return _super.call(this, client) || this;
    }
    UserStore.prototype.AddUser = function (UserObject) {
        var _this = this;
        this.Add(UserObject.id, UserObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.UserStore.AddUser.Store',
            });
        });
    };
    UserStore.prototype.RemoveUser = function (UserId) {
        var _this = this;
        this.Delete(UserId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.UserStore.RemoveUser.Store',
            });
        });
    };
    UserStore.prototype.Fetch = function (UserId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(UserId));
        });
    };
    return UserStore;
}(Store_1.default));
exports.default = UserStore;
//# sourceMappingURL=UserStore.js.map