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
var GuildStore = /** @class */ (function (_super) {
    __extends(GuildStore, _super);
    /**
     *
     * @param client
     * @constructor
     */
    function GuildStore(client) {
        return _super.call(this, client) || this;
    }
    GuildStore.prototype.AddGuild = function (GuildToBeStored) {
        var _this = this;
        this.Add(GuildToBeStored.id, GuildToBeStored).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.AddTextChannel.Store',
            });
        });
    };
    GuildStore.prototype.ReplaceGuild = function (GuildId, NewGuild) {
        var _this = this;
        this.Replace(GuildId, NewGuild).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.GuildStore.ReplaceGuild.Store',
            });
        });
    };
    GuildStore.prototype.RemoveGuild = function (GuildId) {
        var _this = this;
        this.Delete(GuildId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.GuildStore.RemoveGuild.Store',
            });
        });
    };
    /**
     * Fetch a Guild From id
     * @param GuildId - guild id
     */
    GuildStore.prototype.Fetch = function (GuildId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(GuildId));
        });
    };
    return GuildStore;
}(Store_1.default));
exports.default = GuildStore;
