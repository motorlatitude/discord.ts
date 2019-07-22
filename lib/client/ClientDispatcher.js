"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var MessageReactionEvent_1 = require("./Events/MessageReactionEvent");
var PresenceUpdateEvent_1 = require("./Events/PresenceUpdateEvent");
var ReadyEvent_1 = require("./Events/ReadyEvent");
var ResumedEvent_1 = require("./Events/ResumedEvent");
var TypingStartEvent_1 = require("./Events/TypingStartEvent");
var UserUpdateEvent_1 = require("./Events/UserUpdateEvent");
var VoiceServerUpdateEvent_1 = require("./Events/VoiceServerUpdateEvent");
var VoiceStateEvent_1 = require("./Events/VoiceStateEvent");
var WebhooksUpdateEvent_1 = require("./Events/WebhooksUpdateEvent");
var ClientDispatcher = /** @class */ (function () {
    function ClientDispatcher(client, connection) {
        this.Client = client;
        this.connection = connection;
    }
    /**
     * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
     * @param message - message object
     */
    ClientDispatcher.prototype.Parse = function (message) {
        var _this = this;
        this.connection.GatewaySequence = message.s;
        this.Client.logger.write().info({
            message: 'Received ' + message.t + ' Event',
            service: 'ClientConnection.ClientDispatcher.Parse',
        });
        switch (message.t) {
            case gatewayevents_1.default.READY: {
                var readyEvent = new ReadyEvent_1.default(this.Client, message.d);
                readyEvent.Handle();
                break;
            }
            case gatewayevents_1.default.RESUMED: {
                this.connection.resuming = false;
                var resumedEvent = new ResumedEvent_1.default(this.Client, message.d);
                resumedEvent.Handle();
                break;
            }
            case gatewayevents_1.default.CHANNEL_CREATE: {
                var channel = new ChannelEvent_1.default(this.Client, message.d);
                channel.HandleCreate().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.CHANNEL_CREATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.CHANNEL_UPDATE: {
                var channel = new ChannelEvent_1.default(this.Client, message.d);
                channel.HandleUpdate().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.CHANNEL_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.CHANNEL_DELETE: {
                var channel = new ChannelEvent_1.default(this.Client, message.d);
                channel.HandleDelete().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.CHANNEL_DELETE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.CHANNEL_PINS_UPDATE: {
                var channelPins = new ChannelPinsUpdateEvent_1.default(this.Client, message.d);
                channelPins.Handle().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.CHANNEL_PINS_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_CREATE: {
                var guild = new GuildEvent_1.default(this.Client);
                guild.HandleCreate(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_CREATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_UPDATE: {
                var guild = new GuildEvent_1.default(this.Client);
                guild.HandleUpdate(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_DELETE: {
                var guild = new GuildEvent_1.default(this.Client);
                guild.HandleDelete(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_DELETE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_BAN_ADD: {
                var guildBan = new GuildBanEvent_1.default(this.Client, message.d);
                guildBan.HandleBanAdd().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_BAN_ADD',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_BAN_REMOVE: {
                var guildBan = new GuildBanEvent_1.default(this.Client, message.d);
                guildBan.HandleBanRemove().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_BAN_REMOVE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_EMOJIS_UPDATE: {
                var guildEmoji = new GuildEmojisUpdateEvent_1.default(this.Client, message.d);
                guildEmoji.Handle().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_EMOJIS_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_INTEGRATIONS_UPDATE: {
                var guildIntegration = new GuildIntegrationEvent_1.default(this.Client, message.d);
                guildIntegration.Handle().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_INTEGRATIONS_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_ADD: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.Client);
                guildMemberEvent.HandleMemberAdd(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_MEMBER_ADD',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_REMOVE: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.Client);
                guildMemberEvent.HandleMemberRemove(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_MEMBER_REMOVE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBER_UPDATE: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.Client);
                guildMemberEvent.HandleMemberUpdate(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_MEMBER_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_MEMBERS_CHUNK: {
                var guildMemberEvent = new GuildMemberEvent_1.default(this.Client);
                guildMemberEvent.HandleMembersChunk(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_MEMBERS_CHUNK',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_CREATE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.Client, message.d);
                guildRoleEvent.HandleRoleCreate().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_ROLE_CREATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_UPDATE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.Client, message.d);
                guildRoleEvent.HandleRoleUpdate().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_ROLE_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.GUILD_ROLE_DELETE: {
                var guildRoleEvent = new GuildRoleEvent_1.default(this.Client, message.d);
                guildRoleEvent.HandleRoleDelete().catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.GUILD_ROLE_DELETE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.MESSAGE_CREATE: {
                var messageEvent = new MessageEvent_1.default(this.Client);
                messageEvent.HandleMessageCreate(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.MESSAGE_CREATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.MESSAGE_UPDATE: {
                var messageEvent = new MessageEvent_1.default(this.Client);
                messageEvent.HandleMessageUpdate(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.MESSAGE_UPDATE',
                    });
                });
                break;
            }
            case gatewayevents_1.default.MESSAGE_DELETE || gatewayevents_1.default.MESSAGE_DELETE_BULK: {
                var messageEvent = new MessageEvent_1.default(this.Client);
                messageEvent.HandleMessageDelete(message.d).catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientConnection.ClientDispatcher.Parse.MESSAGE_DELETE | MESSAGE_DELETE_BULK',
                    });
                });
                break;
            }
            case gatewayevents_1.default.MESSAGE_REACTION_ADD: {
                var messageReactionEvent = new MessageReactionEvent_1.default(this.Client, message.d);
                messageReactionEvent.HandleReactionAdd();
                break;
            }
            case gatewayevents_1.default.MESSAGE_REACTION_REMOVE: {
                var messageReactionEvent = new MessageReactionEvent_1.default(this.Client, message.d);
                messageReactionEvent.HandleReactionRemove();
                break;
            }
            case gatewayevents_1.default.MESSAGE_REACTION_REMOVE_ALL: {
                var messageReactionEvent = new MessageReactionEvent_1.default(this.Client, message.d);
                messageReactionEvent.HandleReactionRemoveAll();
                break;
            }
            case gatewayevents_1.default.PRESENCE_UPDATE: {
                var presenceUpdate = new PresenceUpdateEvent_1.default(this.Client, message.d);
                presenceUpdate.Handle();
                break;
            }
            case gatewayevents_1.default.TYPING_START: {
                var typingStartEvent = new TypingStartEvent_1.default(this.Client, message.d);
                typingStartEvent.Handle();
                break;
            }
            case gatewayevents_1.default.USER_UPDATE: {
                var userUpdateEvent = new UserUpdateEvent_1.default(this.Client, message.d);
                userUpdateEvent.Handle();
                break;
            }
            case gatewayevents_1.default.VOICE_STATE_UPDATE: {
                var voiceStateUpdateEvent = new VoiceStateEvent_1.default(this.Client, message.d);
                voiceStateUpdateEvent.Handle();
                break;
            }
            case gatewayevents_1.default.VOICE_SERVER_UPDATE: {
                var voiceServerUpdate = new VoiceServerUpdateEvent_1.default(this.Client, message.d);
                voiceServerUpdate.Handle();
                break;
            }
            case gatewayevents_1.default.WEBHOOKS_UPDATE: {
                var webhookUpdateEvent = new WebhooksUpdateEvent_1.default(this.Client, message.d);
                webhookUpdateEvent.Handle();
                break;
            }
            default: {
                this.Client.logger.write().warn({
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
//# sourceMappingURL=ClientDispatcher.js.map