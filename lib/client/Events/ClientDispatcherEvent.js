"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientDispatcherEvent = /** @class */ (function () {
    function ClientDispatcherEvent(client) {
        this.Client = client;
    }
    ClientDispatcherEvent.prototype.Handle = function (EventType) {
        this.EmitEvent();
    };
    /**
     * Emit Event to DiscordClient Class, this method should always be overwritten
     */
    ClientDispatcherEvent.prototype.EmitEvent = function () {
        this.Client.logger.write().warn({
            message: new Error('No Event Defined'),
            service: 'ClientDispatcher.Events.ClientDispatcherEvent.EmitEvent',
        });
    };
    return ClientDispatcherEvent;
}());
exports.default = ClientDispatcherEvent;
//# sourceMappingURL=ClientDispatcherEvent.js.map