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
var GuildMemberActions = /** @class */ (function (_super) {
    __extends(GuildMemberActions, _super);
    function GuildMemberActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get a specific guild member, this will call the API
     * @param UserId - the user id of the guild member to call
     */
    GuildMemberActions.prototype.GetMember = function (UserId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildMember(_this.Guild.id, UserId)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Get all guild members
     * @constructor
     */
    GuildMemberActions.prototype.GetAllMembers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.ListGuildMembers(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Add a new member to this guild
     * @param UserId - the user id of the user to add to the guild
     * @param GuildMemberObject - an object containing member information
     */
    GuildMemberActions.prototype.AddMember = function (UserId, GuildMemberObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.AddGuildMember(_this.Guild.id, UserId, GuildMemberObject)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Remove a member from the guild
     * @param UserId - the user id of the member to be removed
     */
    GuildMemberActions.prototype.RemoveMember = function (UserId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.RemoveGuildMember(_this.Guild.id, UserId)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildMemberActions;
}(GuildAction_1.default));
exports.default = GuildMemberActions;
//# sourceMappingURL=GuildMemberActions.js.map