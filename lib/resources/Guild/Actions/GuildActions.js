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
var GuildAuditActions_1 = require("./GuildAuditActions");
var GuildBanActions_1 = require("./GuildBanActions");
var GuildChannelActions_1 = require("./GuildChannelActions");
var GuildEmbedActions_1 = require("./GuildEmbedActions");
var GuildIntegrationActions_1 = require("./GuildIntegrationActions");
var GuildInviteActions_1 = require("./GuildInviteActions");
var GuildMemberActions_1 = require("./GuildMemberActions");
var GuildPruneActions_1 = require("./GuildPruneActions");
var GuildRoleActions_1 = require("./GuildRoleActions");
var GuildUserActions_1 = require("./GuildUserActions");
var GuildVanityURLActions_1 = require("./GuildVanityURLActions");
var GuildVoiceRegionActions_1 = require("./GuildVoiceRegionActions");
var GuildActions = /** @class */ (function (_super) {
    __extends(GuildActions, _super);
    function GuildActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Carry out channel actions on this guild
     */
    GuildActions.prototype.Channels = function () {
        return new GuildChannelActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out member actions on this guild
     */
    GuildActions.prototype.Members = function () {
        return new GuildMemberActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out user actions on this guild
     */
    GuildActions.prototype.Users = function () {
        return new GuildUserActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out ban actions on this guild
     */
    GuildActions.prototype.Bans = function () {
        return new GuildBanActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out role actions on this guild
     */
    GuildActions.prototype.Roles = function () {
        return new GuildRoleActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out prune actions on this guild
     */
    GuildActions.prototype.Prune = function () {
        return new GuildPruneActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out voice region actions on this guild
     */
    GuildActions.prototype.VoiceRegions = function () {
        return new GuildVoiceRegionActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out voice region actions on this guild
     */
    GuildActions.prototype.Invites = function () {
        return new GuildInviteActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out guild integration actions on this guild
     */
    GuildActions.prototype.Integrations = function () {
        return new GuildIntegrationActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out embed actions on this guild
     */
    GuildActions.prototype.Embed = function () {
        return new GuildEmbedActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out vanity url actions on this guild
     */
    GuildActions.prototype.VanityURL = function () {
        return new GuildVanityURLActions_1.default(this.Client, this.Guild);
    };
    /**
     * Carry out audit actions on this guild
     */
    GuildActions.prototype.Audit = function () {
        return new GuildAuditActions_1.default(this.Client, this.Guild);
    };
    /**
     * Modify this guild, this will call the API
     * @param Parameters - parameters to alter https://discordapp.com/developers/docs/resources/guild#modify-guild-json-params
     */
    GuildActions.prototype.Modify = function (Parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.ModifyGuild(_this.Guild.id, Parameters)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Deletes this guild, this will call the API
     */
    GuildActions.prototype.Delete = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.DeleteGuild(_this.Guild.id)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildActions;
}(GuildAction_1.default));
exports.default = GuildActions;
//# sourceMappingURL=GuildActions.js.map