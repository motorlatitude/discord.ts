"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadyEvent_1 = require("./Events/ReadyEvent");
// Constants
var gatewayevents_1 = require("../common/constants/gatewayevents");
var ChannelEvent_1 = require("./Events/ChannelEvent");
var ChannelPinsUpdateEvent_1 = require("./Events/ChannelPinsUpdateEvent");
var GuildBanEvent_1 = require("./Events/GuildBanEvent");
var GuildEmojisUpdateEvent_1 = require("./Events/GuildEmojisUpdateEvent");
var GuildEvent_1 = require("./Events/GuildEvent");
var GuildIntegrationEvent_1 = require("./Events/GuildIntegrationEvent");
var GuildMemberEvent_1 = require("./Events/GuildMemberEvent");
var GuildRoleEvent_1 = require("./Events/GuildRoleEvent");
var MessageEvent_1 = require("./Events/MessageEvent");
var ClientDispatcher = /** @class */ (function () {
    function ClientDispatcher(app, connection, log) {
        this.App = app;
        this.connection = connection;
        this.logger = log;
    }
    /**
     * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
     * @param message - message object
     */
    ClientDispatcher.prototype.Parse = function (message) {
        this.connection.GatewaySequence = message.s || 0;
        this.logger.write().debug({
            message: 'Received ' + message.t + ' Event',
            service: 'ClientConnection.ClientDispatcher.Parse',
        });
        switch (message.t) {
            case gatewayevents_1.default.READY: {
                var readyEvent = new ReadyEvent_1.default(this.App, message.d);
                readyEvent.Handle();
                break;
            }
            case gatewayevents_1.default.CHANNEL_CREATE: {
                var channel = new ChannelEvent_1.default(this.App, message.d);
                channel.HandleCreate();
                break;
            }
            case gatewayevents_1.default.CHANNEL_UPDATE: {
                var channel = new ChannelEvent_1.default(this.App, message.d);
                channel.HandleUpdate();
                break;
            }
            case gatewayevents_1.default.CHANNEL_DELETE: {
                var channel = new ChannelEvent_1.default(this.App, message.d);
                channel.HandleDelete();
                break;
            }
            case gatewayevents_1.default.CHANNEL_PINS_UPDATE: {
                var channelPins = new ChannelPinsUpdateEvent_1.default(this.App, message.d);
                channelPins.Handle();
                break;
            }
            case gatewayevents_1.default.GUILD_CREATE: {
                var guild = new GuildEvent_1.default(this.App);
                guild.HandleCreate(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_UPDATE: {
                var guild = new GuildEvent_1.default(this.App);
                guild.HandleUpdate(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_DELETE: {
                var guild = new GuildEvent_1.default(this.App);
                guild.HandleDelete(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_BAN_ADD: {
                var guildBan = new GuildBanEvent_1.default(this.App, message.d);
                guildBan.HandleBanAdd();
                break;
            }
            case gatewayevents_1.default.GUILD_BAN_REMOVE: {
                var guildBan = new GuildBanEvent_1.default(this.App, message.d);
                guildBan.HandleBanRemove();
                break;
            }
            case gatewayevents_1.default.GUILD_EMOJIS_UPDATE: {
                var guildEmoji = new GuildEmojisUpdateEvent_1.default(this.App, message.d);
                guildEmoji.Handle();
                break;
            }
            case gatewayevents_1.default.GUILD_INTEGRATIONS_UPDATE: {
                var guildIntegration = new GuildIntegrationEvent_1.default(this.App, message.d);
                guildIntegration.Handle();
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_ADD: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.App);
                guildMemberEvent.HandleMemberAdd(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_REMOVE: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.App);
                guildMemberEvent.HandleMemberRemove(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_UPDATE: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.App);
                guildMemberEvent.HandleMemberUpdate(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBERS_CHUNK: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.App);
                guildMemberEvent.HandleMemberChunk(message.d);
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_CREATE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.App, message.d);
                guildRoleEvent.HandleRoleCreate();
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_UPDATE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.App, message.d);
                guildRoleEvent.HandleRoleUpdate();
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_DELETE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.App, message.d);
                guildRoleEvent.HandleRoleDelete();
                break;
            }
            case gatewayevents_1.default.MESSAGE_CREATE: {
                var messageEvent = new MessageEvent_1.default(this.App);
                messageEvent.HandleMessageCreate(message.d);
                break;
            }
            case gatewayevents_1.default.MESSAGE_UPDATE: {
                var messageEvent = new MessageEvent_1.default(this.App);
                messageEvent.HandleMessageUpdate(message.d);
                break;
            }
            case gatewayevents_1.default.MESSAGE_DELETE || gatewayevents_1.default.MESSAGE_DELETE_BULK: {
                var messageEvent = new MessageEvent_1.default(this.App);
                messageEvent.HandleMessageDelete(message.d);
                break;
            }
            default: {
                this.logger.write().warn({
                    message: 'Received A Message That Is Not Handled: ' + message.t,
                    service: 'ClientConnection.ClientDispatcher.Parse.UNHANDLED_MESSAGE_TYPE',
                });
                break;
            }
        }
    };
    return ClientDispatcher;
}());
exports.default = ClientDispatcher;
