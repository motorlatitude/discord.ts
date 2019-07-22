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
var DirectMessageChannel_1 = require("../../resources/Channel/DirectMessageChannel");
var TextChannel_1 = require("../../resources/Channel/TextChannel");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var ChannelPinsUpdateEvent = /** @class */ (function (_super) {
    __extends(ChannelPinsUpdateEvent, _super);
    function ChannelPinsUpdateEvent(client, message) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'CHANNEL_PINS_UPDATE';
        _this.Message = message;
        return _this;
    }
    ChannelPinsUpdateEvent.prototype.Handle = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.Client.Guilds.Fetch(this.Message.guild_id)
                .then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchAllTypes(_this.Message.channel_id)
                    .then(function (AffectedChannel) {
                    if (AffectedChannel instanceof TextChannel_1.default) {
                        _this.EventObject = {
                            Channel: AffectedChannel,
                            Guild: AffectedGuild,
                            LastPinTimestamp: _this.Message.last_pin_timestamp,
                        };
                        _super.prototype.Handle.call(_this);
                    }
                    else {
                        _this.Client.logger.write().error({
                            message: new Error('This channel cannot have a pinned message'),
                            service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
                        });
                    }
                })
                    .catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
                });
            });
        }
        else {
            // DM
            this.Client.Channels.FetchAllTypes(this.Message.channel_id).then(function (AffectedChannel) {
                if (AffectedChannel instanceof TextChannel_1.default || AffectedChannel instanceof DirectMessageChannel_1.default) {
                    _this.EventObject = {
                        Channel: AffectedChannel,
                        LastPinTimestamp: _this.Message.last_pin_timestamp,
                    };
                    _super.prototype.Handle.call(_this);
                }
                else {
                    _this.Client.logger.write().error({
                        message: new Error('This channel cannot have a pinned message'),
                        service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
                    });
                }
            });
        }
    };
    ChannelPinsUpdateEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'CHANNEL_PINS_UPDATE' && this.EventObject) {
            this.Client.emit(this.EventName, this.EventObject);
        }
    };
    return ChannelPinsUpdateEvent;
}(ClientDispatcherEvent_1.default));
exports.default = ChannelPinsUpdateEvent;
