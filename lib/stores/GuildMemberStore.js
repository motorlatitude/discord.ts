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
var GuildMemberStore = /** @class */ (function (_super) {
    __extends(GuildMemberStore, _super);
    function GuildMemberStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add a new guild member to the store
     * @param member - A Guild Member
     */
    GuildMemberStore.prototype.AddGuildMember = function (member) {
        var _this = this;
        this.Add(member.User.id, member).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.GuildMemberStore.AddGuildMember.Store',
            });
        });
    };
    /**
     * Replace an existing guild member in the store
     * @param UserId - User id of the guild member to replace
     * @param member - The guild member object that will replace the old one
     */
    GuildMemberStore.prototype.ReplaceGuildMember = function (UserId, member) {
        var _this = this;
        this.Replace(UserId, member).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.GuildMemberStore.ReplaceGuildMember.Store',
            });
        });
    };
    /**
     * Update an existing guild member or add a new guild member if the member doesn't already exist in the store
     * @param UserId - User id of the guild member to replace
     * @param member - the guild member object that will replace the old one or should be added
     */
    GuildMemberStore.prototype.UpdateGuildMember = function (UserId, member) {
        if (this.Get(UserId)) {
            this.ReplaceGuildMember(UserId, member);
        }
        else {
            this.AddGuildMember(member);
        }
    };
    /**
     * Remove an existing guild member
     * @param UserId - User id of the guild member to remove
     */
    GuildMemberStore.prototype.RemoveGuildMember = function (UserId) {
        var _this = this;
        this.Delete(UserId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.GuildMemberStore.RemoveGuildMember.Store',
            });
        });
    };
    GuildMemberStore.prototype.Fetch = function (UserId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(UserId));
        });
    };
    GuildMemberStore.prototype.FetchAll = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.GetAll());
        });
    };
    return GuildMemberStore;
}(Store_1.default));
exports.default = GuildMemberStore;
