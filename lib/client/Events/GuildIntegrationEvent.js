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
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildIntegrationEvent = /** @class */ (function (_super) {
    __extends(GuildIntegrationEvent, _super);
    function GuildIntegrationEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'GUILD_INTEGRATION_UPDATE';
        _this.Message = msg;
        return _this;
    }
    GuildIntegrationEvent.prototype.Handle = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
            _this.EventObject = AffectedGuild;
        });
        _super.prototype.Handle.call(this);
    };
    GuildIntegrationEvent.prototype.EmitEvent = function () {
        if (this.EventName && this.EventObject) {
            this.Client.emit(this.EventName, this.EventObject);
        }
    };
    return GuildIntegrationEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildIntegrationEvent;
