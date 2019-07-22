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
var GuildIntegrationActions = /** @class */ (function (_super) {
    __extends(GuildIntegrationActions, _super);
    function GuildIntegrationActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * List a guilds integrations
     */
    GuildIntegrationActions.prototype.GetIntegrations = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildIntegrations(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Attach an integration object from the current user to the guild
     * @param NewIntegrationObject - required object containing type and integration id
     */
    GuildIntegrationActions.prototype.CreateIntegration = function (NewIntegrationObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.CreateGuildIntegration(_this.Guild.id, NewIntegrationObject)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Modify an existing integration in the guild
     * @param IntegrationId - the id of the integration to modify
     * @param IntegrationModifyObject - modify parameters, object containing expire_behaviour
     */
    GuildIntegrationActions.prototype.ModifyIntegration = function (IntegrationId, IntegrationModifyObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.ModifyGuildIntegration(_this.Guild.id, IntegrationId, IntegrationModifyObject)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Delete an attached integration
     * @param IntegrationId - the id of the integration to delete
     */
    GuildIntegrationActions.prototype.DeleteIntegration = function (IntegrationId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.DeleteGuildIntegration(_this.Guild.id, IntegrationId)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Sync an attached integration
     * @param IntegrationId - the id of integration to sync
     */
    GuildIntegrationActions.prototype.SyncIntegration = function (IntegrationId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.SyncGuildIntegration(_this.Guild.id, IntegrationId)
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildIntegrationActions;
}(GuildAction_1.default));
exports.default = GuildIntegrationActions;
//# sourceMappingURL=GuildIntegrationActions.js.map