"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channeltypes_1 = require("../../common/constants/channeltypes");
var ChannelStore_1 = require("../../stores/ChannelStore");
var EmojiStore_1 = require("../../stores/EmojiStore");
var GuildMemberStore_1 = require("../../stores/GuildMemberStore");
var PresenceStore_1 = require("../../stores/PresenceStore");
var RoleStore_1 = require("../../stores/RoleStore");
var VoiceStateStore_1 = require("../../stores/VoiceStateStore");
var VoiceConnection_1 = require("../../voice/VoiceConnection");
var VoiceManager_1 = require("../../voice/VoiceManager");
var CategoryChannel_1 = require("../Channel/CategoryChannel");
var TextChannel_1 = require("../Channel/TextChannel");
var VoiceChannel_1 = require("../Channel/VoiceChannel");
var Presence_1 = require("../User/Presence");
var VoiceState_1 = require("../Voice/VoiceState");
var GuildActions_1 = require("./Actions/GuildActions");
var Emoji_1 = require("./Emoji");
var GuildMember_1 = require("./GuildMember");
var Role_1 = require("./Role");
var Guild = /** @class */ (function () {
    function Guild(client, GuildObject) {
        this.Client = client;
        this.id = GuildObject.id;
        this.Name = GuildObject.name;
        this.OwnerId = GuildObject.owner_id;
        this.Region = GuildObject.region;
        this.AfkTimeout = GuildObject.afk_timeout;
        this.VerificationLevel = GuildObject.verification_level;
        this.DefaultMessageNotification = GuildObject.default_message_notifications;
        this.ExplicitContentFilter = GuildObject.explicit_content_filter;
        this.Roles = new RoleStore_1.default(client);
        if (this.Roles) {
            this.ResolveRoles(GuildObject.roles);
        }
        this.Emojis = new EmojiStore_1.default(this.Client);
        this.ResolveEmojis(GuildObject.emojis);
        this.Features = GuildObject.features || [];
        this.MFALevel = GuildObject.mfa_level;
        this.PremiumTier = GuildObject.premium_tier;
        this.PremiumSubscriptionCount = GuildObject.premium_subscription_count ? GuildObject.premium_subscription_count : 0;
        this.Banner = GuildObject.banner === '' ? undefined : GuildObject.banner;
        this.Description = GuildObject.description === '' ? undefined : GuildObject.description;
        this.VanityURLCode = GuildObject.vanity_url_code === '' ? undefined : GuildObject.vanity_url_code;
        this.MaxMembers = GuildObject.max_members;
        this.MaxPresences =
            GuildObject.max_presences === undefined || GuildObject.max_presences === null ? 5000 : GuildObject.max_presences;
        this.Channels = new ChannelStore_1.default(this.Client);
        if (GuildObject.channels) {
            this.ResolveChannels(GuildObject.channels);
        }
        this.Presences = new PresenceStore_1.default(this.Client);
        this.Members = new GuildMemberStore_1.default(this.Client);
        if (GuildObject.members) {
            this.ResolveMembersAndPresences(GuildObject.members, GuildObject.presences);
        }
        this.VoiceStates = new VoiceStateStore_1.default(this.Client);
        if (GuildObject.voice_states) {
            this.ResolveVoiceStates(GuildObject.voice_states);
        }
        this.MemberCount = GuildObject.member_count ? GuildObject.member_count : 0;
        this.Unavailable = GuildObject.unavailable;
        this.Large = GuildObject.large;
        this.JoinedAt = GuildObject.joined_at;
        this.SystemChannelId = GuildObject.system_channel_id;
        this.WidgetChannelId = GuildObject.widget_channel_id;
        this.WidgetEnabled = GuildObject.widget_enabled;
        this.ApplicationId = GuildObject.application_id;
        this.EmbedChannelId = GuildObject.embed_channel_id === null ? undefined : GuildObject.embed_channel_id;
        this.EmbedEnabled = GuildObject.embed_enabled;
        this.AfkChannelId = GuildObject.afk_channel_id === null ? undefined : GuildObject.afk_channel_id;
        this.Permissions = GuildObject.permissions;
        this.Owner = GuildObject.owner;
        this.Icon = GuildObject.icon;
        this.Splash = GuildObject.splash;
    }
    Object.defineProperty(Guild.prototype, "PendingVoiceConnection", {
        get: function () {
            if (this._PendingVoiceConnection) {
                return this._PendingVoiceConnection;
            }
            return false;
        },
        set: function (PVC) {
            this._PendingVoiceConnection = PVC;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Guild.prototype, "PendingVoiceServerDetails", {
        get: function () {
            return this._PendingVoiceServerDetails;
        },
        set: function (PVSD) {
            this._PendingVoiceServerDetails = PVSD;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new voice connection for this guild
     * @param Token - token provided as part of the voice server update event payload
     * @param Endpoint - endpoint provided as part of the voice server update event payload
     */
    Guild.prototype.CreateVoiceConnection = function (Token, Endpoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.Client.User) {
                var RelevantVoiceState = _this.VoiceStates.Get(_this.Client.User.id);
                if (RelevantVoiceState && RelevantVoiceState.SessionId) {
                    var NewVoiceConnection_1 = new VoiceConnection_1.default(_this.Client, _this, Token, Endpoint, RelevantVoiceState.SessionId);
                    NewVoiceConnection_1.on('VOICE_READY', function () {
                        resolve(new VoiceManager_1.default(_this.Client, NewVoiceConnection_1));
                    });
                    NewVoiceConnection_1.Connect();
                }
                else {
                    reject(new Error('No Relevant Voice State Found'));
                }
            }
            else {
                reject(new Error('Client has no User'));
            }
        });
    };
    /**
     * Carry out actions on this guild (these will call Discords REST API)
     */
    Guild.prototype.Actions = function () {
        return new GuildActions_1.default(this.Client, this);
    };
    Guild.prototype.ResolveVoiceStates = function (VoiceStates) {
        for (var _i = 0, VoiceStates_1 = VoiceStates; _i < VoiceStates_1.length; _i++) {
            var voiceState = VoiceStates_1[_i];
            var NewVoiceState = new VoiceState_1.default(this.Client, voiceState, this);
            this.VoiceStates.AddVoiceState(NewVoiceState);
        }
    };
    Guild.prototype.ResolvePresences = function (presences) {
        for (var _i = 0, presences_1 = presences; _i < presences_1.length; _i++) {
            var presence = presences_1[_i];
            presence.guild_id = this.id;
            var NewPresence = new Presence_1.default(this.Client, presence);
            this.Presences.AddPresence(NewPresence);
        }
    };
    Guild.prototype.ResolveRoles = function (roles) {
        for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
            var role = roles_1[_i];
            this.Roles.AddRole(new Role_1.default(role));
        }
    };
    Guild.prototype.ResolveEmojis = function (emojis) {
        for (var _i = 0, emojis_1 = emojis; _i < emojis_1.length; _i++) {
            var emoji = emojis_1[_i];
            this.Emojis.AddEmoji(new Emoji_1.default(emoji));
        }
    };
    Guild.prototype.ResolveMembersAndPresences = function (members, presences) {
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            this.Members.AddGuildMember(new GuildMember_1.default(member));
        }
        // presences need to be resolved after members
        if (presences) {
            this.ResolvePresences(presences);
        }
    };
    Guild.prototype.ResolveChannels = function (channels) {
        for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
            var channel = channels_1[_i];
            if (channel.type === channeltypes_1.default.GUILD_TEXT) {
                this.Channels.AddTextChannel(new TextChannel_1.default(this.Client, channel, this));
            }
            else if (channel.type === channeltypes_1.default.GUILD_VOICE) {
                this.Channels.AddVoiceChannel(new VoiceChannel_1.default(this.Client, channel, this));
            }
            else if (channel.type === channeltypes_1.default.GUILD_CATEGORY) {
                this.Channels.AddChannelCategory(new CategoryChannel_1.default(this.Client, channel, this));
            }
        }
    };
    return Guild;
}());
exports.default = Guild;
//# sourceMappingURL=Guild.js.map