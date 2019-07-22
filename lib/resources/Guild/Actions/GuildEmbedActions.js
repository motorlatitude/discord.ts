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
var GuildEmbedActions = /** @class */ (function (_super) {
    __extends(GuildEmbedActions, _super);
    function GuildEmbedActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get this guilds embed
     */
    GuildEmbedActions.prototype.GetEmbed = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildEmbed(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Modify the guild embed
     * @param NewGuildEmbed - the altered properties of the embed
     */
    GuildEmbedActions.prototype.ModifyEmbed = function (NewGuildEmbed) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.ModifyGuildEmbed(_this.Guild.id, NewGuildEmbed)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildEmbedActions;
}(GuildAction_1.default));
exports.default = GuildEmbedActions;
//# sourceMappingURL=GuildEmbedActions.js.map