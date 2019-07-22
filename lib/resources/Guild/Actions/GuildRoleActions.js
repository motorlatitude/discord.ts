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
var GuildAction_1 = require("./GuildAction");
var GuildRoleActions = /** @class */ (function (_super) {
    __extends(GuildRoleActions, _super);
    function GuildRoleActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get roles in this guild
     */
    GuildRoleActions.prototype.GetRoles = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildRoles(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Creates a new role in this guild
     * @param NewGuildRole - role object containing the new role's properties
     */
    GuildRoleActions.prototype.CreateRole = function (NewGuildRole) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.CreateGuildRole(_this.Guild.id, NewGuildRole)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildRoleActions;
}(GuildAction_1.default));
exports.default = GuildRoleActions;
//# sourceMappingURL=GuildRoleActions.js.map