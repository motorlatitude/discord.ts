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
var GuildChannelActions = /** @class */ (function (_super) {
    __extends(GuildChannelActions, _super);
    function GuildChannelActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Request Guild Channels, this will call the API
     */
    GuildChannelActions.prototype.GetChannels = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildChannels(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Create a new channel in this guild, this will call the API
     * @param NewChannelObject - the new channel object
     */
    GuildChannelActions.prototype.CreateNewChannel = function (NewChannelObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.CreateGuildChannel(_this.Guild.id, NewChannelObject)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildChannelActions;
}(GuildAction_1.default));
exports.default = GuildChannelActions;
//# sourceMappingURL=GuildChannelActions.js.map