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
var GuildVoiceRegionActions = /** @class */ (function (_super) {
    __extends(GuildVoiceRegionActions, _super);
    function GuildVoiceRegionActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * List available voice regions for this server
     */
    GuildVoiceRegionActions.prototype.GetVoiceRegions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildVoiceRegions(_this.Guild.id)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildVoiceRegionActions;
}(GuildAction_1.default));
exports.default = GuildVoiceRegionActions;
//# sourceMappingURL=GuildVoiceRegionActions.js.map