import CHANNEL_TYPES from '../../common/constants/channeltypes';
import {
  IDiscordChannel,
  IDiscordEmoji,
  IDiscordGuild,
  IDiscordGuildMember,
  IDiscordPresenceUpdate,
  IDiscordRole,
  IDiscordVoiceState,
} from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ChannelStore from '../../stores/ChannelStore';
import EmojiStore from '../../stores/EmojiStore';
import GuildMemberStore from '../../stores/GuildMemberStore';
import PresenceStore from '../../stores/PresenceStore';
import RoleStore from '../../stores/RoleStore';
import VoiceStateStore from '../../stores/VoiceStateStore';
import CategoryChannel from '../Channel/CategoryChannel';
import TextChannel from '../Channel/TextChannel';
import VoiceChannel from '../Channel/VoiceChannel';
import Presence from '../User/Presence';
import VoiceState from '../Voice/VoiceState';
import Emoji from './Emoji';
import GuildMember from './GuildMember';
import Role from './Role';

export default class Guild {
  public id: string;
  public Name: string;
  public OwnerId: string;
  public Region: string;
  public AfkTimeout: number;
  public VerificationLevel: number;
  public DefaultMessageNotification: number;
  public ExplicitContentFilter: number;
  public Roles: RoleStore;
  public Emojis: EmojiStore;
  public Features: string[];
  public MFALevel: number;
  public MaxMembers: number;
  public PremiumTier: number;

  public PremiumSubscriptionCount: number | undefined;
  public Banner: string | undefined;
  public Description: string | undefined;
  public VanityURLCode: string | undefined;
  public MaxPresences: number | undefined;
  public Presences: PresenceStore;
  public Channels: ChannelStore;
  public Members: GuildMemberStore;
  public VoiceStates: VoiceStateStore;
  public MemberCount: number | undefined;
  public Unavailable: boolean | undefined;
  public Large: boolean | undefined;
  public JoinedAt: number | undefined;
  public SystemChannelId: string | undefined;
  public WidgetChannelId: string | undefined;
  public WidgetEnabled: boolean | undefined;
  public ApplicationId: string | undefined;
  public EmbedChannelId: string | undefined;
  public EmbedEnabled: boolean | undefined;
  public AfkChannelId: string | undefined;
  public Permissions: number | undefined;
  public Owner: boolean | undefined;
  public Icon: string | undefined;
  public Splash: string | undefined;

  private Client: DiscordClient;

  constructor(client: DiscordClient, GuildObject: IDiscordGuild) {
    this.Client = client;

    this.id = GuildObject.id;
    this.Name = GuildObject.name;
    this.OwnerId = GuildObject.owner_id;
    this.Region = GuildObject.region;
    this.AfkTimeout = GuildObject.afk_timeout;
    this.VerificationLevel = GuildObject.verification_level;
    this.DefaultMessageNotification = GuildObject.default_message_notifications;
    this.ExplicitContentFilter = GuildObject.explicit_content_filter;
    this.Roles = new RoleStore(client);
    if (this.Roles) {
      this.ResolveRoles(GuildObject.roles);
    }
    this.Emojis = new EmojiStore(this.Client);
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
    this.Presences = new PresenceStore(this.Client);
    if (GuildObject.presences) {
      this.ResolvePresences(GuildObject.presences);
    }
    this.Channels = new ChannelStore(this.Client);
    if (GuildObject.channels) {
      this.ResolveChannels(GuildObject.channels);
    }
    this.Members = new GuildMemberStore(this.Client);
    if (GuildObject.members) {
      this.ResolveMembers(GuildObject.members);
    }
    this.VoiceStates = new VoiceStateStore(this.Client);
    if (GuildObject.voice_states) {
      this.ResolveVoiceStates(GuildObject.voice_states);
    }
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

  private ResolveVoiceStates(VoiceStates: IDiscordVoiceState[]): void {
    for (const voiceState of VoiceStates) {
      const NewVoiceState: VoiceState = new VoiceState(this.Client, voiceState);
      NewVoiceState.GuildId = this.id;
      NewVoiceState.Guild = this;
      this.VoiceStates.AddVoiceState(NewVoiceState);
    }
  }

  private ResolvePresences(presences: IDiscordPresenceUpdate[]): void {
    for (const presence of presences) {
      this.Presences.AddPresence(new Presence(this.Client, presence));
    }
  }

  private ResolveRoles(roles: IDiscordRole[]): void {
    for (const role of roles) {
      this.Roles.AddRole(new Role(role));
    }
  }

  private ResolveEmojis(emojis: IDiscordEmoji[]): void {
    for (const emoji of emojis) {
      this.Emojis.AddEmoji(new Emoji(emoji));
    }
  }

  private ResolveMembers(members: IDiscordGuildMember[]): void {
    for (const member of members) {
      this.Members.AddGuildMember(new GuildMember(member));
    }
  }

  private ResolveChannels(channels: IDiscordChannel[]): void {
    for (const channel of channels) {
      if (channel.type === CHANNEL_TYPES.GUILD_TEXT) {
        this.Channels.AddTextChannel(new TextChannel(this.Client, channel));
      } else if (channel.type === CHANNEL_TYPES.GUILD_VOICE) {
        this.Channels.AddVoiceChannel(new VoiceChannel(this.Client, channel));
      } else if (channel.type === CHANNEL_TYPES.GUILD_CATEGORY) {
        this.Channels.AddChannelCategory(new CategoryChannel(this.Client, channel));
      }
    }
  }
}
