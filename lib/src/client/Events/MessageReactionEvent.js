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
var Reaction_1 = require("../../resources/Message/Reaction");
var ReactionEmoji_1 = require("../../resources/Message/ReactionEmoji");
var ReactionStore_1 = require("../../stores/ReactionStore");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var MessageReactionEvent = /** @class */ (function (_super) {
    __extends(MessageReactionEvent, _super);
    function MessageReactionEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles MESSAGE_REACTION_ADD event
     */
    MessageReactionEvent.prototype.HandleReactionAdd = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.GetGuildAndChannel().then(function (_a) {
                var AffectedGuild = _a[0], AffectedChannel = _a[1];
                if (_this.Message.user_id) {
                    AffectedGuild.Members.Fetch(_this.Message.user_id).then(function (AffectedMember) {
                        _this.UpdateMessage(AffectedChannel);
                        _this.EventName = 'MESSAGE_REACTION_ADD';
                        _this.EventUserObject = AffectedMember.User;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventMessageId = _this.Message.message_id;
                        _this.EventGuildObject = AffectedGuild;
                        // ReactionEmoji is separate from a regular emoji and has no methods as of currently but can be used to
                        // find the relevant emoji if required
                        _this.EventEmojiObject = new ReactionEmoji_1.default(_this.Message.emoji);
                        _this.Handle();
                    });
                }
            });
        }
        else {
            // DM
            this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(function (AffectedChannel) {
                if (_this.Message.user_id) {
                    AffectedChannel.Recipients.Fetch(_this.Message.user_id).then(function (AffectedUser) {
                        _this.UpdateMessage(AffectedChannel);
                        _this.EventName = 'MESSAGE_REACTION_ADD';
                        _this.EventUserObject = AffectedUser;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventMessageId = _this.Message.message_id;
                        _this.EventEmojiObject = new ReactionEmoji_1.default(_this.Message.emoji);
                        _this.Handle();
                    });
                }
            });
        }
    };
    /**
     * Handles MESSAGE_REACTION_REMOVE event
     */
    MessageReactionEvent.prototype.HandleReactionRemove = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.GetGuildAndChannel().then(function (_a) {
                var AffectedGuild = _a[0], AffectedChannel = _a[1];
                if (_this.Message.user_id) {
                    AffectedGuild.Members.Fetch(_this.Message.user_id).then(function (AffectedMember) {
                        // We may not have relevant message
                        var AffectedMessage = AffectedChannel.Messages.Get(_this.Message.message_id);
                        if (AffectedMessage) {
                            AffectedMessage.Reactions.RemoveReaction(_this.Message.emoji.name);
                        }
                        _this.EventName = 'MESSAGE_REACTION_REMOVE';
                        _this.EventUserObject = AffectedMember.User;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventMessageId = _this.Message.message_id;
                        _this.EventGuildObject = AffectedGuild;
                        // ReactionEmoji is separate from a regular emoji and has no methods as of currently but can be used to
                        // find the relevant emoji if required
                        _this.EventEmojiObject = new ReactionEmoji_1.default(_this.Message.emoji);
                        _this.Handle();
                    });
                }
            });
        }
        else {
            // DM
            this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(function (AffectedChannel) {
                if (_this.Message.user_id) {
                    AffectedChannel.Recipients.Fetch(_this.Message.user_id).then(function (AffectedUser) {
                        // We may not have relevant message
                        var AffectedMessage = AffectedChannel.Messages.Get(_this.Message.message_id);
                        if (AffectedMessage) {
                            AffectedMessage.Reactions.RemoveReaction(_this.Message.emoji.name);
                        }
                        _this.EventName = 'MESSAGE_REACTION_REMOVE';
                        _this.EventUserObject = AffectedUser;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventMessageId = _this.Message.message_id;
                        _this.EventEmojiObject = new ReactionEmoji_1.default(_this.Message.emoji);
                        _this.Handle();
                    });
                }
            });
        }
    };
    MessageReactionEvent.prototype.HandleReactionRemoveAll = function () {
        var _this = this;
        if (this.Message.guild_id) {
            this.GetGuildAndChannel().then(function (_a) {
                var AffectedGuild = _a[0], AffectedChannel = _a[1];
                // We may not have relevant message
                var AffectedMessage = AffectedChannel.Messages.Get(_this.Message.message_id);
                if (AffectedMessage) {
                    AffectedMessage.Reactions = new ReactionStore_1.default(_this.Client);
                }
                _this.EventName = 'MESSAGE_REACTION_REMOVE_ALL';
                _this.EventChannelObject = AffectedChannel;
                _this.EventMessageId = _this.Message.message_id;
                _this.EventGuildObject = AffectedGuild;
                _this.Handle();
            });
        }
        else {
            // DM
            this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(function (AffectedChannel) {
                // We may not have relevant message
                var AffectedMessage = AffectedChannel.Messages.Get(_this.Message.message_id);
                if (AffectedMessage) {
                    AffectedMessage.Reactions = new ReactionStore_1.default(_this.Client);
                }
                _this.EventName = 'MESSAGE_REACTION_REMOVE_ALL';
                _this.EventChannelObject = AffectedChannel;
                _this.EventMessageId = _this.Message.message_id;
                _this.Handle();
            });
        }
    };
    MessageReactionEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'MESSAGE_REACTION_ADD' || this.EventName === 'MESSAGE_REACTION_REMOVE') {
            if (this.EventChannelObject && this.EventMessageId && this.EventEmojiObject && this.EventUserObject) {
                this.Client.emit(this.EventName, this.EventChannelObject, this.EventMessageId, this.EventEmojiObject, this.EventUserObject, this.EventGuildObject);
            }
        }
        else if (this.EventName === 'MESSAGE_REACTION_REMOVE_ALL') {
            if (this.EventChannelObject && this.EventMessageId) {
                this.Client.emit(this.EventName, this.EventChannelObject, this.EventMessageId, this.EventGuildObject);
            }
        }
    };
    MessageReactionEvent.prototype.UpdateMessage = function (AffectedChannel) {
        // We may not have relevant message
        var AffectedMessage = AffectedChannel.Messages.Get(this.Message.message_id);
        if (AffectedMessage && this.Client.User) {
            var NewReaction = new Reaction_1.default({
                count: 1,
                emoji: this.Message.emoji,
                me: this.Client.User.id === this.Message.user_id,
            });
            AffectedMessage.Reactions.UpdateReaction(NewReaction);
        }
    };
    MessageReactionEvent.prototype.GetGuildAndChannel = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.Client.Guilds.Fetch(_this.Message.guild_id)
                .then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchTextChannel(_this.Message.channel_id)
                    .then(function (AffectedChannel) {
                    resolve([AffectedGuild, AffectedChannel]);
                })
                    .catch(function (err) {
                    _this.Client.logger.write().error({
                        message: err,
                        service: 'ClientDispatcher.Events.MessageReactionEvent.GetGuildAndChannel',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageReactionEvent.GetGuildAndChannel',
                });
            });
        });
    };
    return MessageReactionEvent;
}(ClientDispatcherEvent_1.default));
exports.default = MessageReactionEvent;
