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
var Message_1 = require("../../resources/Message/Message");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var MessageEvent = /** @class */ (function (_super) {
    __extends(MessageEvent, _super);
    function MessageEvent(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Handles MESSAGE_CREATE event
     * @param msg - the created message
     */
    MessageEvent.prototype.HandleMessageCreate = function (msg) {
        var _this = this;
        if (msg.guild_id) {
            this.Client.Guilds.Fetch(msg.guild_id)
                .then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchTextChannel(msg.channel_id)
                    .then(function (AffectedChannel) {
                    AffectedGuild.Members.Fetch(msg.author.id)
                        .then(function (AffectedMember) {
                        var NewMessage = new Message_1.default(_this.Client, msg);
                        NewMessage.SetGuildMessage(msg.guild_id, AffectedGuild, AffectedMember, AffectedChannel);
                        AffectedChannel.Messages.AddMessage(NewMessage);
                        _this.EventName = 'MESSAGE_CREATE';
                        _this.EventMessageObject = NewMessage;
                        _this.EventAuthorObject = NewMessage.Author;
                        _this.EventGuildObject = AffectedGuild;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventMemberObject = AffectedMember;
                        _this.Handle();
                    })
                        .catch(function (err) {
                        _this.Client.logger.write().warn({
                            message: err,
                            service: 'ClientDispatcher.Events.MessageEvent.HandleMessageCreate.Guild.Members.Fetch',
                        });
                    });
                })
                    .catch(function (err) {
                    _this.Client.logger.write().warn({
                        message: err,
                        service: 'ClientDispatcher.Events.MessageEvent.HandleMessageCreate.Guild.Channel.FetchTextChannel',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageEvent.HandleMessageCreate.Guild.Fetch',
                });
            });
        }
        else {
            // Message is not part of a guild, so DM
            this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
                .then(function (AffectedChannel) {
                var NewMessage = new Message_1.default(_this.Client, msg);
                NewMessage.SetDirectMessage(AffectedChannel);
                AffectedChannel.Messages.AddMessage(NewMessage);
                _this.EventName = 'MESSAGE_CREATE';
                _this.EventMessageObject = NewMessage;
                _this.EventAuthorObject = NewMessage.Author;
                _this.EventChannelObject = AffectedChannel;
                _this.Handle();
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageEvent.HandleMessageCreate.Channels.FetchDirectMessageChannel',
                });
            });
        }
    };
    /**
     * Handles MESSAGE_UPDATE event
     * @param msg - partial message object, must contain id and channel_id and will contain guild_id if message is part of a guild
     */
    MessageEvent.prototype.HandleMessageUpdate = function (msg) {
        var _this = this;
        if (msg.guild_id) {
            this.Client.Guilds.Fetch(msg.guild_id)
                .then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchTextChannel(msg.channel_id)
                    .then(function (AffectedChannel) {
                    AffectedChannel.Messages.Fetch(msg.id)
                        .then(function (AffectedMessage) {
                        // TODO seems hacky, figure something better out here
                        var ResolvedMessage = AffectedMessage.Resolve();
                        for (var MessageKey in msg) {
                            // @ts-ignore
                            if (ResolvedMessage[MessageKey] !== msg[MessageKey]) {
                                // @ts-ignore
                                ResolvedMessage[MessageKey] = msg[MessageKey];
                            }
                        }
                        var NewMessage = new Message_1.default(_this.Client, ResolvedMessage);
                        NewMessage.SetGuildMessage(msg.guild_id, AffectedGuild, AffectedMessage.Member, AffectedChannel);
                        AffectedChannel.Messages.ReplaceMessage(msg.id, NewMessage);
                        _this.EventName = 'MESSAGE_UPDATE';
                        _this.EventMessageObject = NewMessage;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventAuthorObject = NewMessage.Author;
                        _this.EventGuildObject = AffectedGuild;
                        _this.EventMemberObject = NewMessage.Member;
                        _this.Handle();
                    })
                        .catch(function (err) {
                        _this.Client.logger.write().warn({
                            message: err,
                            service: 'ClientDispatcher.Events.MessageEvent.HandleMessageUpdate.Messages.Fetch',
                        });
                    });
                })
                    .catch(function (err) {
                    _this.Client.logger.write().warn({
                        message: err,
                        service: 'ClientDispatcher.Events.MessageEvent.HandleMessageUpdate.Channels.Fetch',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageEvent.HandleMessageUpdate.Guilds.Fetch',
                });
            });
        }
        else {
            // Message is not part of a guild, so DM
            this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
                .then(function (AffectedChannel) {
                AffectedChannel.Messages.Fetch(msg.id)
                    .then(function (AffectedMessage) {
                    // TODO seems hacky, figure something better out here
                    var ResolvedMessage = AffectedMessage.Resolve();
                    for (var MessageKey in msg) {
                        // @ts-ignore
                        if (ResolvedMessage[MessageKey] !== msg[MessageKey]) {
                            // @ts-ignore
                            ResolvedMessage[MessageKey] = msg[MessageKey];
                        }
                    }
                    var NewMessage = new Message_1.default(_this.Client, ResolvedMessage);
                    NewMessage.SetDirectMessage(AffectedChannel);
                    AffectedChannel.Messages.ReplaceMessage(msg.id, NewMessage);
                    _this.EventName = 'MESSAGE_UPDATE';
                    _this.EventMessageObject = NewMessage;
                    _this.EventChannelObject = AffectedChannel;
                    _this.EventAuthorObject = NewMessage.Author;
                    _this.Handle();
                })
                    .catch(function (err) {
                    _this.Client.logger.write().warn({
                        message: err,
                        service: 'ClientDispatcher.Events.MessageEvent.HandleMessageUpdate.Messages.Fetch',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageEvent.HandleMessageUpdate.Channels.Fetch',
                });
            });
        }
    };
    /**
     * Handles MESSAGE_DELETE and MESSAGE_DELETE_BULK events
     * @param msg - message ids, channel id and guild_id
     */
    MessageEvent.prototype.HandleMessageDelete = function (msg) {
        var _this = this;
        if (msg.guild_id) {
            this.Client.Guilds.Fetch(msg.guild_id)
                .then(function (AffectedGuild) {
                AffectedGuild.Channels.FetchTextChannel(msg.channel_id)
                    .then(function (AffectedChannel) {
                    if (msg.id) {
                        AffectedChannel.Messages.Fetch(msg.id)
                            .then(function (AffectedMessage) {
                            AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);
                            _this.EventName = 'MESSAGE_DELETE';
                            _this.EventMessageObject = AffectedMessage;
                            _this.EventChannelObject = AffectedChannel;
                            _this.EventAuthorObject = AffectedMessage.Author;
                            _this.EventGuildObject = AffectedGuild;
                            _this.EventMemberObject = AffectedMessage.Member;
                            _this.Handle();
                        })
                            .catch(function (err) {
                            _this.Client.logger.write().warn({
                                message: err,
                                service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Messages.Fetch',
                            });
                        });
                    }
                    else if (msg.ids) {
                        AffectedChannel.Messages.FetchAllFor(msg.ids)
                            .then(function (AffectedMessages) {
                            for (var _i = 0, AffectedMessages_1 = AffectedMessages; _i < AffectedMessages_1.length; _i++) {
                                var MessageObject = AffectedMessages_1[_i];
                                AffectedChannel.Messages.DeleteMessage(MessageObject.id);
                            }
                            _this.EventName = 'MESSAGE_DELETE_BULK';
                            _this.EventBulkMessageObject = AffectedMessages;
                            _this.EventChannelObject = AffectedChannel;
                            _this.EventGuildObject = AffectedGuild;
                            _this.Handle();
                        })
                            .catch(function (err) {
                            _this.Client.logger.write().warn({
                                message: err,
                                service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Messages.FetchAllFor',
                            });
                        });
                    }
                    else {
                        _this.Client.logger.write().warn({
                            message: 'A MESSAGE_DELETE or MESSAGE_DELETE_BULK event was sent without id or ids present',
                            service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete',
                        });
                    }
                })
                    .catch(function (err) {
                    _this.Client.logger.write().warn({
                        message: err,
                        service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Channels.FetchTextChannel',
                    });
                });
            })
                .catch(function (err) {
                _this.Client.logger.write().warn({
                    message: err,
                    service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Guilds.Fetch',
                });
            });
        }
        else {
            // DM Channel
            this.Client.Channels.FetchDirectMessageChannel(msg.channel_id).then(function (AffectedChannel) {
                if (msg.id) {
                    AffectedChannel.Messages.Fetch(msg.id)
                        .then(function (AffectedMessage) {
                        AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);
                        _this.EventName = 'MESSAGE_DELETE';
                        _this.EventMessageObject = AffectedMessage;
                        _this.EventChannelObject = AffectedChannel;
                        _this.EventAuthorObject = AffectedMessage.Author;
                        _this.Handle();
                    })
                        .catch(function (err) {
                        _this.Client.logger.write().warn({
                            message: err,
                            service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Messages.Fetch',
                        });
                    });
                }
                else if (msg.ids) {
                    AffectedChannel.Messages.FetchAllFor(msg.ids)
                        .then(function (AffectedMessages) {
                        for (var _i = 0, AffectedMessages_2 = AffectedMessages; _i < AffectedMessages_2.length; _i++) {
                            var MessageObject = AffectedMessages_2[_i];
                            AffectedChannel.Messages.DeleteMessage(MessageObject.id);
                        }
                        _this.EventName = 'MESSAGE_DELETE_BULK';
                        _this.EventBulkMessageObject = AffectedMessages;
                        _this.EventChannelObject = AffectedChannel;
                        _this.Handle();
                    })
                        .catch(function (err) {
                        _this.Client.logger.write().warn({
                            message: err,
                            service: 'ClientDispatcher.Events.MessageEvent.HandleMessageDelete.Messages.FetchAllFor',
                        });
                    });
                }
            });
        }
    };
    MessageEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'MESSAGE_CREATE' ||
            this.EventName === 'MESSAGE_UPDATE' ||
            this.EventName === 'MESSAGE_DELETE') {
            if (this.EventMessageObject && this.EventChannelObject && this.EventAuthorObject) {
                this.Client.emit(this.EventName, this.EventMessageObject, this.EventChannelObject, this.EventAuthorObject, this.EventGuildObject, this.EventMemberObject);
            }
        }
        else if (this.EventName === 'MESSAGE_DELETE_BULK') {
            if (this.EventBulkMessageObject && this.EventChannelObject) {
                this.Client.emit(this.EventName, this.EventBulkMessageObject, this.EventChannelObject, this.EventGuildObject);
            }
        }
    };
    return MessageEvent;
}(ClientDispatcherEvent_1.default));
exports.default = MessageEvent;
