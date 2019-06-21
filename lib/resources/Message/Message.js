"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../User/User");
var Message = /** @class */ (function () {
    function Message(MessageObject) {
        this.id = MessageObject.id;
        this.ChannelId = MessageObject.channel_id;
        this.Author = new User_1.default(MessageObject.author);
        this.Content = MessageObject.content;
        this.Timestamp = MessageObject.timestamp;
        this.TTS = MessageObject.tts;
        this.MentionEveryone = MessageObject.mention_everyone;
        this.Mentions = [];
        for (var _i = 0, _a = MessageObject.mentions; _i < _a.length; _i++) {
            var mention = _a[_i];
            this.Mentions.push(new User_1.default(mention));
        }
        this.MentionRoles = MessageObject.mention_roles;
        this.Attachments = MessageObject.attachments;
        this.Embeds = MessageObject.embeds;
        this.Pinned = MessageObject.pinned;
        this.Type = MessageObject.type;
        this.GuildId = MessageObject.guild_id;
        this.EditedTimestamp = MessageObject.edited_timestamp;
        this.Reactions = MessageObject.reactions;
        this.Nonce = MessageObject.nonce;
        this.WebhookId = MessageObject.webhook_id;
        this.Activity = MessageObject.activity;
        this.Application = MessageObject.application;
    }
    /**
     * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
     * Sets this message as a Direct Message
     * @param Channel - Direct Message Channel that this message is part of
     */
    Message.prototype.SetDirectMessage = function (Channel) {
        this.Channel = Channel;
    };
    /**
     * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
     * Sets this message as a Text message in a guild
     * @param GuildId - Guild Id of the guild that the message is part of
     * @param MessageGuild - the guild that the message is part of
     * @param Member - guild member of the author
     * @param Channel - the text channel that the message is part of
     */
    Message.prototype.SetGuildMessage = function (GuildId, MessageGuild, Member, Channel) {
        this.GuildId = GuildId;
        this.Member = Member;
        this.Channel = Channel;
    };
    /**
     * Resolve Message class to IDiscordMessage
     */
    Message.prototype.Resolve = function () {
        var ResolvedMentions = [];
        for (var _i = 0, _a = this.Mentions; _i < _a.length; _i++) {
            var mention = _a[_i];
            ResolvedMentions.push(mention.Resolve());
        }
        var ResolvedMember = this.Member ? this.Member.Resolve() : undefined;
        // WARN make sure when solving above TODOs that they are accurately resolved below
        return {
            activity: this.Activity,
            application: this.Application,
            attachments: this.Attachments,
            author: this.Author.Resolve(),
            channel_id: this.ChannelId,
            content: this.Content,
            edited_timestamp: this.EditedTimestamp,
            embeds: this.Embeds,
            guild_id: this.GuildId,
            id: this.id,
            member: ResolvedMember,
            mention_everyone: this.MentionEveryone,
            mention_roles: this.MentionRoles,
            mentions: ResolvedMentions,
            nonce: this.Nonce,
            pinned: this.Pinned,
            reactions: this.Reactions,
            timestamp: this.Timestamp,
            tts: this.TTS,
            type: this.Type,
            webhook_id: this.WebhookId,
        };
    };
    return Message;
}());
exports.default = Message;