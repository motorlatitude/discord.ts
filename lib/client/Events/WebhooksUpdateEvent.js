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
var WebhooksUpdateEvent = /** @class */ (function (_super) {
    __extends(WebhooksUpdateEvent, _super);
    function WebhooksUpdateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'WEBHOOKS_UPDATE';
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles WEBHOOKS_UPDATE
     * Sent when a guild channel's webhook is created, updated, or deleted.
     */
    WebhooksUpdateEvent.prototype.Handle = function () {
        var _this = this;
        this.EventGuildObject = this.Client.Guilds.Get(this.Message.guild_id);
        if (this.EventGuildObject) {
            this.EventGuildObject.Channels.FetchTextChannel(this.Message.channel_id).then(function (AffectedChannel) {
                _this.EventChannelObject = AffectedChannel;
                _super.prototype.Handle.call(_this);
            });
        }
    };
    WebhooksUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventChannelObject && this.EventGuildObject) {
            this.Client.emit(this.EventName, this.EventChannelObject, this.EventGuildObject);
        }
    };
    return WebhooksUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = WebhooksUpdateEvent;
//# sourceMappingURL=WebhooksUpdateEvent.js.map