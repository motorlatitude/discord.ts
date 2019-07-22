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
var GuildPruneActions = /** @class */ (function (_super) {
    __extends(GuildPruneActions, _super);
    function GuildPruneActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets number of people that would be pruned
     * @param Days - number of days to count prune for
     */
    GuildPruneActions.prototype.GetPruneCount = function (Days) {
        var _this = this;
        if (Days === void 0) { Days = 1; }
        return new Promise(function (resolve, reject) {
            _this.Endpoint.GetGuildPruneCount(_this.Guild.id, Days)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Start guild prune
     * @param Days - number of days to count prune for
     * @param ComputePruneCount - compute the number of people pruned, recommended false for large guilds
     */
    GuildPruneActions.prototype.Prune = function (Days, ComputePruneCount) {
        var _this = this;
        if (ComputePruneCount === void 0) { ComputePruneCount = false; }
        return new Promise(function (resolve, reject) {
            _this.Endpoint.BeginGuildPrune(_this.Guild.id, Days, ComputePruneCount)
                .then(function (Response) {
                resolve(Response.body);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GuildPruneActions;
}(GuildAction_1.default));
exports.default = GuildPruneActions;
//# sourceMappingURL=GuildPruneActions.js.map