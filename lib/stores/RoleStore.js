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
var RoleStore = /** @class */ (function (_super) {
    __extends(RoleStore, _super);
    function RoleStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add a new role to the store
     * @param RoleObject - A Role
     */
    RoleStore.prototype.AddRole = function (RoleObject) {
        var _this = this;
        this.Add(RoleObject.id, RoleObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.RoleStore.AddRole.Store',
            });
        });
    };
    /**
     * Replace an existing role in the store
     * @param RoleId - id of role to replace
     * @param RoleObject - the role to replace it with
     */
    RoleStore.prototype.ReplaceRole = function (RoleId, RoleObject) {
        var _this = this;
        this.Replace(RoleId, RoleObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.RoleStore.ReplaceRole.Store',
            });
        });
    };
    /**
     * Replace an existing role if it exists or add a new one if it doesn't
     * @param RoleId - id of the role to replace
     * @param RoleObject - the role to replace it with or to add
     */
    RoleStore.prototype.UpdateRole = function (RoleId, RoleObject) {
        if (this.Get(RoleId)) {
            this.ReplaceRole(RoleId, RoleObject);
        }
        else {
            this.AddRole(RoleObject);
        }
    };
    RoleStore.prototype.RemoveRole = function (RoleId) {
        var _this = this;
        this.Delete(RoleId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.RemoveRole.Store',
            });
        });
    };
    /**
     * Fetch role for role id
     * @param RoleId - id of role
     */
    RoleStore.prototype.Fetch = function (RoleId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(RoleId));
        });
    };
    return RoleStore;
}(Store_1.default));
exports.default = RoleStore;
