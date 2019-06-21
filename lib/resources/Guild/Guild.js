"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChannelStore_1 = require("../../stores/ChannelStore");
var TextChannel_1 = require("../Channel/TextChannel");
var VoiceChannel_1 = require("../Channel/VoiceChannel");
var channeltypes_1 = require("../../common/constants/channeltypes");
var EmojiStore_1 = require("../../stores/EmojiStore");
var GuildMemberStore_1 = require("../../stores/GuildMemberStore");
var RoleStore_1 = require("../../stores/RoleStore");
var CategoryChannel_1 = require("../Channel/CategoryChannel");
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
        this.MaxMembers = GuildObject.max_members;
        this.PremiumTier = GuildObject.premium_tier;
        this.PremiumSubscriptionCount = GuildObject.premium_subscription_count;
        this.Banner = GuildObject.banner;
        this.Description = GuildObject.description;
        this.VanityURLCode = GuildObject.vanity_url_code;
        this.MaxPresences = GuildObject.max_presences;
        this.Presences = GuildObject.presences; // TODO
        this.Channels = new ChannelStore_1.default(this.Client);
        if (GuildObject.channels) {
            this.ResolveChannels(GuildObject.channels);
        }
        this.Members = new GuildMemberStore_1.default(this.Client);
        if (GuildObject.members) {
            this.ResolveMembers(GuildObject.members);
        }
        this.VoiceStates = GuildObject.voice_states; // TODO
        this.MemberCount = GuildObject.member_count;
        this.Unavailable = GuildObject.unavailable;
        this.Large = GuildObject.large;
        this.JoinedAt = GuildObject.joined_at;
        this.SystemChannelId = GuildObject.system_channel_id;
        this.WidgetChannelId = GuildObject.widget_channel_id;
        this.WidgetEnabled = GuildObject.widget_enabled;
        this.EmbedChannelId = GuildObject.embed_channel_id;
        this.EmbedEnabled = GuildObject.embed_enabled;
        this.AfkChannelId = GuildObject.afk_channel_id;
        this.Permissions = GuildObject.permissions;
        this.Owner = GuildObject.owner;
        this.Icon = GuildObject.icon;
        this.Splash = GuildObject.splash;
    }
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
    Guild.prototype.ResolveMembers = function (members) {
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            this.Members.AddGuildMember(new GuildMember_1.default(member));
        }
    };
    Guild.prototype.ResolveChannels = function (channels) {
        for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
            var channel = channels_1[_i];
            if (channel.type === channeltypes_1.default.GUILD_TEXT) {
                this.Channels.AddTextChannel(new TextChannel_1.default(this.Client, channel));
            }
            else if (channel.type === channeltypes_1.default.GUILD_VOICE) {
                this.Channels.AddVoiceChannel(new VoiceChannel_1.default(this.Client, channel));
            }
            else if (channel.type === channeltypes_1.default.GUILD_CATEGORY) {
                this.Channels.AddChannelCategory(new CategoryChannel_1.default(this.Client, channel));
            }
        }
    };
    return Guild;
}());
exports.default = Guild;
