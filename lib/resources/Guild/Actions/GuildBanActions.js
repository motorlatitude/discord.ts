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
var GuildBanActions = /** @class */ (function (_super) {
    __extends(GuildBanActions, _super);
    function GuildBanActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get all banned members for this guild
     */
    GuildBanActions.prototype.GetBans = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildBans(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Get ban for a specific user
     * @param UserId - the user id of the member that is banned
     */
    GuildBanActions.prototype.GetBanForUser = function (UserId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildBan(_this.Guild.id, UserId)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Unban a user that has been banned
     * @param UserId - the user id of the user to be unbanned
     */
    GuildBanActions.prototype.UnbanUser = function (UserId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.RemoveGuildBan(_this.Guild.id, UserId)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildBanActions;
}(GuildAction_1.default));
exports.default = GuildBanActions;
//# sourceMappingURL=GuildBanActions.js.map