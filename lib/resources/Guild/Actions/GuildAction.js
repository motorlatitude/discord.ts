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
var Action_1 = require("../../Actions/Action");
var GuildAction = /** @class */ (function (_super) {
    __extends(GuildAction, _super);
    function GuildAction(client, guild) {
        var _this = _super.call(this, client) || this;
        _this.Guild = guild;
        _this.Endpoint = _this.Client.DiscordAPIManager.Methods().GuildMethods();
        return _this;
    }
    return GuildAction;
}(Action_1.default));
exports.default = GuildAction;
//# sourceMappingURL=GuildAction.js.map