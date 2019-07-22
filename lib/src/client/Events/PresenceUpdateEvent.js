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
var Presence_1 = require("../../resources/User/Presence");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var PresenceUpdateEvent = /** @class */ (function (_super) {
    __extends(PresenceUpdateEvent, _super);
    function PresenceUpdateEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'PRESENCE_UPDATE';
        _this.Message = msg;
        return _this;
    }
    PresenceUpdateEvent.prototype.Handle = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id).then(function (AffectedGuild) {
            var OldPresence = AffectedGuild.Presences.Get(_this.Message.user.id);
            var NewPresence = new Presence_1.default(_this.Client, _this.Message);
            AffectedGuild.Presences.UpdatePresence(_this.Message.user.id, NewPresence);
            _this.EventNewPresence = NewPresence;
            _this.EventOldPresence = OldPresence;
            _super.prototype.Handle.call(_this);
        });
    };
    PresenceUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventNewPresence) {
            this.Client.emit(this.EventName, this.EventNewPresence, this.EventOldPresence);
        }
    };
    return PresenceUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = PresenceUpdateEvent;
