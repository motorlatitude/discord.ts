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
var events_1 = require("../../common/constants/events");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var TextChannel_1 = require("../../resources/Channel/TextChannel");
var channeltypes_1 = require("../../common/constants/channeltypes");
var CategoryChannel_1 = require("../../resources/Channel/CategoryChannel");
var DirectMessageChannel_1 = require("../../resources/Channel/DirectMessageChannel");
var VoiceChannel_1 = require("../../resources/Channel/VoiceChannel");
var ChannelEvents = /** @class */ (function (_super) {
    __extends(ChannelEvents, _super);
    function ChannelEvents(client, data) {
        var _this = _super.call(this, client) || this;
        _this.DiscordChannel = data;
        return _this;
    }
    /**
     * Handle CHANNEL_CREATE event
     * @constructor
     */
    ChannelEvents.prototype.HandleCreate = function () {
        this.EventName = events_1.default.CHANNEL_CREATE;
        if (this.DiscordChannel.type === channeltypes_1.default.GUILD_TEXT) {
            var NewTextChannel = new TextChannel_1.default(this.DiscordChannel);
            this.EventObject = NewTextChannel;
            this.client.Channels.AddTextChannel(NewTextChannel);
        }
        else if (this.DiscordChannel.type === channeltypes_1.default.GUILD_VOICE) {
            var NewVoiceChannel = new VoiceChannel_1.default(this.DiscordChannel);
            this.EventObject = NewVoiceChannel;
            this.client.Channels.AddVoiceChannel(NewVoiceChannel);
        }
        else if (this.DiscordChannel.type === channeltypes_1.default.DM || this.DiscordChannel.type === channeltypes_1.default.GROUP_DM) {
            var NewDMChannel = new DirectMessageChannel_1.default(this.DiscordChannel);
            this.EventObject = NewDMChannel;
            this.client.Channels.AddDMChannel(NewDMChannel);
        }
        else if (this.DiscordChannel.type === channeltypes_1.default.GUILD_CATEGORY) {
            var NewChannelCategory = new CategoryChannel_1.default(this.DiscordChannel);
            this.EventObject = NewChannelCategory;
            this.client.Channels.AddChannelCategory(NewChannelCategory);
        }
        this.Handle();
    };
    return ChannelEvents;
}(ClientDispatcherEvent_1.default));
exports.default = ChannelEvents;