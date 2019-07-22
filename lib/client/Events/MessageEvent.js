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
        return new Promise(function (resolve, reject) {
            if (msg.guild_id) {
                var AffectedGuild_1;
                var AffectedChannel_1;
                _this.Client.Guilds.Fetch(msg.guild_id)
                    .then(function (FoundGuild) {
                    AffectedGuild_1 = FoundGuild;
                    return AffectedGuild_1.Channels.FetchTextChannel(msg.channel_id);
                })
                    .then(function (FoundChannel) {
                    AffectedChannel_1 = FoundChannel;
                    return AffectedGuild_1.Members.Fetch(msg.author.id);
                })
                    .then(function (AffectedMember) {
                    var NewMessage = new Message_1.default(_this.Client, msg);
                    NewMessage.SetGuildMessage(msg.guild_id, AffectedGuild_1, AffectedMember, AffectedChannel_1);
                    AffectedChannel_1.Messages.AddMessage(NewMessage);
                    _this.EventName = 'MESSAGE_CREATE';
                    _this.EventMessageObject = NewMessage;
                    _this.EventAuthorObject = NewMessage.Author;
                    _this.EventGuildObject = AffectedGuild_1;
                    _this.EventChannelObject = AffectedChannel_1;
                    _this.EventMemberObject = AffectedMember;
                    _this.Handle();
                    resolve({
                        AffectedGuild: AffectedGuild_1,
                        AffectedGuildMember: AffectedMember,
                        Author: NewMessage.Author,
                        Channel: AffectedChannel_1,
                        Content: NewMessage,
                    });
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            else {
                // Message is not part of a guild, so DM
                _this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
                    .then(function (AffectedChannel) {
                    var NewMessage = new Message_1.default(_this.Client, msg);
                    NewMessage.SetDirectMessage(AffectedChannel);
                    AffectedChannel.Messages.AddMessage(NewMessage);
                    _this.EventName = 'MESSAGE_CREATE';
                    _this.EventMessageObject = NewMessage;
                    _this.EventAuthorObject = NewMessage.Author;
                    _this.EventChannelObject = AffectedChannel;
                    _this.Handle();
                    resolve({
                        Author: NewMessage.Author,
                        Channel: AffectedChannel,
                        Content: NewMessage,
                    });
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    /**
     * Handles MESSAGE_UPDATE event
     * @param msg - partial message object, must contain id and channel_id and will contain guild_id if message is part of a guild
     */
    MessageEvent.prototype.HandleMessageUpdate = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (msg.guild_id) {
                var AffectedGuild_2;
                var AffectedChannel_2;
                _this.Client.Guilds.Fetch(msg.guild_id)
                    .then(function (FoundGuild) {
                    AffectedGuild_2 = FoundGuild;
                    return AffectedGuild_2.Channels.FetchTextChannel(msg.channel_id);
                })
                    .then(function (FoundChannel) {
                    AffectedChannel_2 = FoundChannel;
                    return AffectedChannel_2.Messages.Fetch(msg.id);
                })
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
                    NewMessage.SetGuildMessage(msg.guild_id, AffectedGuild_2, AffectedMessage.Member, AffectedChannel_2);
                    AffectedChannel_2.Messages.ReplaceMessage(msg.id, NewMessage);
                    _this.EventName = 'MESSAGE_UPDATE';
                    _this.EventMessageObject = NewMessage;
                    _this.EventChannelObject = AffectedChannel_2;
                    _this.EventAuthorObject = NewMessage.Author;
                    _this.EventGuildObject = AffectedGuild_2;
                    _this.EventMemberObject = NewMessage.Member;
                    _this.Handle();
                    resolve({
                        AffectedGuild: AffectedGuild_2,
                        AffectedGuildMember: NewMessage.Member,
                        Author: NewMessage.Author,
                        Channel: AffectedChannel_2,
                        Content: NewMessage,
                    });
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            else {
                // Message is not part of a guild, so DM
                var AffectedChannel_3;
                _this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
                    .then(function (FoundChannel) {
                    AffectedChannel_3 = FoundChannel;
                    return AffectedChannel_3.Messages.Fetch(msg.id);
                })
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
                    NewMessage.SetDirectMessage(AffectedChannel_3);
                    AffectedChannel_3.Messages.ReplaceMessage(msg.id, NewMessage);
                    _this.EventName = 'MESSAGE_UPDATE';
                    _this.EventMessageObject = NewMessage;
                    _this.EventChannelObject = AffectedChannel_3;
                    _this.EventAuthorObject = NewMessage.Author;
                    _this.Handle();
                    resolve({
                        Author: NewMessage.Author,
                        Channel: AffectedChannel_3,
                        Content: NewMessage,
                    });
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    /**
     * Handles MESSAGE_DELETE and MESSAGE_DELETE_BULK events
     * @param msg - message ids, channel id and guild_id
     */
    MessageEvent.prototype.HandleMessageDelete = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (msg.guild_id) {
                var AffectedGuild_3;
                _this.Client.Guilds.Fetch(msg.guild_id)
                    .then(function (FoundGuild) {
                    AffectedGuild_3 = FoundGuild;
                    return AffectedGuild_3.Channels.FetchTextChannel(msg.channel_id);
                })
                    .then(function (AffectedChannel) {
                    if (msg.id) {
                        AffectedChannel.Messages.Fetch(msg.id)
                            .then(function (AffectedMessage) {
                            AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);
                            _this.EventName = 'MESSAGE_DELETE';
                            _this.EventMessageObject = AffectedMessage;
                            _this.EventChannelObject = AffectedChannel;
                            _this.EventAuthorObject = AffectedMessage.Author;
                            _this.EventGuildObject = AffectedGuild_3;
                            _this.EventMemberObject = AffectedMessage.Member;
                            _this.Handle();
                            resolve({
                                AffectedGuild: AffectedGuild_3,
                                AffectedGuildMember: AffectedMessage.Member,
                                Author: AffectedMessage.Author,
                                Channel: AffectedChannel,
                                Content: AffectedMessage,
                            });
                        })
                            .catch(function (err) {
                            reject(err);
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
                            _this.EventGuildObject = AffectedGuild_3;
                            _this.Handle();
                            resolve({
                                AffectedGuild: AffectedGuild_3,
                                Channel: AffectedChannel,
                                Messages: AffectedMessages,
                            });
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(new Error('A MESSAGE_DELETE or MESSAGE_DELETE_BULK event was sent without id or ids present'));
                    }
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            else {
                // DM Channel
                _this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
                    .then(function (AffectedChannel) {
                    if (msg.id) {
                        AffectedChannel.Messages.Fetch(msg.id)
                            .then(function (AffectedMessage) {
                            AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);
                            _this.EventName = 'MESSAGE_DELETE';
                            _this.EventMessageObject = AffectedMessage;
                            _this.EventChannelObject = AffectedChannel;
                            _this.EventAuthorObject = AffectedMessage.Author;
                            _this.Handle();
                            resolve({
                                Author: AffectedMessage.Author,
                                Channel: AffectedChannel,
                                Content: AffectedMessage,
                            });
                        })
                            .catch(function (err) {
                            reject(err);
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
                            resolve({
                                Channel: AffectedChannel,
                                Messages: AffectedMessages,
                            });
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
        });
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
//# sourceMappingURL=MessageEvent.js.map