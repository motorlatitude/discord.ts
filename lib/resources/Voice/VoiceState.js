"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VoiceState = /** @class */ (function () {
    /**
     * Create A VoiceState
     * WARN the guild parameter should only be set when loading from a GUILD_CREATE event
     * @param Client - The DiscordClient instance
     * @param VoiceStateObject - Discord Voice state object
     * @param guild - the guild instance
     * @constructor
     */
    function VoiceState(Client, VoiceStateObject, guild) {
        var _this = this;
        this.UserId = VoiceStateObject.user_id;
        this.SessionId = VoiceStateObject.session_id;
        this.Deaf = VoiceStateObject.deaf;
        this.Mute = VoiceStateObject.mute;
        this.SelfDeaf = VoiceStateObject.self_deaf;
        this.SelfMute = VoiceStateObject.self_mute;
        this.Suppress = VoiceStateObject.suppress;
        this.Client = Client;
        this.ChannelId = VoiceStateObject.channel_id;
        if (guild) {
            this.GuildId = guild.id;
            this.Guild = guild;
            this.GuildMember = this.Guild.Members.Get(this.UserId);
            if (this.ChannelId) {
                this.SetVoiceChannel(this.ChannelId);
            }
            else {
                // Left A Guild Voice Channel
            }
        }
        else {
            this.GuildId = VoiceStateObject.guild_id;
            if (this.GuildId) {
                Client.Guilds.Fetch(this.GuildId).then(function (AffectedGuild) {
                    _this.Guild = AffectedGuild;
                    _this.GuildMember = _this.Guild.Members.Get(_this.UserId);
                    if (_this.ChannelId) {
                        _this.SetVoiceChannel(_this.ChannelId);
                    }
                    else {
                        // Left A Guild Voice Channel
                    }
                });
            }
            else if (this.ChannelId) {
                this.SetVoiceChannel(this.ChannelId);
            }
            else {
                // Left A Private Voice Channel
            }
        }
    }
    VoiceState.prototype.SetVoiceChannel = function (ChannelId) {
        var _this = this;
        this.Client.Channels.FetchVoiceChannel(ChannelId)
            .then(function (AffectChannel) {
            _this.VoiceChannel = AffectChannel;
        })
            .catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'Guild.VoiceState',
            });
        });
    };
    return VoiceState;
}());
exports.default = VoiceState;
//# sourceMappingURL=VoiceState.js.map