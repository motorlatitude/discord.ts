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
var PresenceStore = /** @class */ (function (_super) {
    __extends(PresenceStore, _super);
    function PresenceStore(client) {
        return _super.call(this, client) || this;
    }
    PresenceStore.prototype.AddPresence = function (PresenceObject) {
        var _this = this;
        if (PresenceObject.User) {
            this.Add(PresenceObject.User.id, PresenceObject).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.PresenceStore.AddPresence.Store',
                });
            });
        }
        else {
            // We need a valid user id
            this.Client.logger.write().error({
                message: new Error("Couldn't add presence as no User is present"),
                service: 'DiscordClient.PresenceStore.AddPresence',
            });
        }
    };
    PresenceStore.prototype.UpdatePresence = function (UserId, PresenceObject) {
        var _this = this;
        if (this.Get(UserId)) {
            this.Replace(UserId, PresenceObject).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.PresenceStore.UpdatePresence.Store',
                });
            });
        }
        else {
            this.AddPresence(PresenceObject);
        }
    };
    PresenceStore.prototype.Get = function (UserId) {
        return _super.prototype.Get.call(this, UserId);
    };
    return PresenceStore;
}(Store_1.default));
exports.default = PresenceStore;
