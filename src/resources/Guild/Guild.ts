import CHANNEL_TYPES from '../../common/constants/channeltypes';
import {
  IDiscordChannel,
  IDiscordEmoji,
  IDiscordGuild,
  IDiscordGuildMember,
  IDiscordPresenceUpdate,
  IDiscordRole,
  IDiscordVoiceServerGatewayEvent,
  IDiscordVoiceState,
} from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ChannelStore from '../../stores/ChannelStore';
import EmojiStore from '../../stores/EmojiStore';
import GuildMemberStore from '../../stores/GuildMemberStore';
import PresenceStore from '../../stores/PresenceStore';
import RoleStore from '../../stores/RoleStore';
import VoiceStateStore from '../../stores/VoiceStateStore';
import VoiceConnection from '../../voice/VoiceConnection';
import VoiceManager from '../../voice/VoiceManager';
import CategoryChannel from '../Channel/CategoryChannel';
import TextChannel from '../Channel/TextChannel';
import VoiceChannel from '../Channel/VoiceChannel';
import Presence from '../User/Presence';
import VoiceState from '../Voice/VoiceState';
import GuildActions from './Actions/GuildActions';
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
  public PremiumTier: number;

  public VoiceConnection?: VoiceConnection;

  public PremiumSubscriptionCount: number;
  public Banner?: string;
  public Description?: string;
  public VanityURLCode?: string;
  public MaxPresences: number;
  public MaxMembers?: number;
  public Presences: PresenceStore;
  public Channels: ChannelStore;
  public Members: GuildMemberStore;
  public VoiceStates: VoiceStateStore;
  public MemberCount: number | undefined; // TODO update for MEMBER events
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

  private readonly Client: DiscordClient;

  private _PendingVoiceConnection?: boolean;
  private _PendingVoiceServerDetails?: IDiscordVoiceServerGatewayEvent;

  public get PendingVoiceConnection(): boolean {
    if (this._PendingVoiceConnection) {
      return this._PendingVoiceConnection;
    }
    return false;
  }

  public set PendingVoiceConnection(PVC: boolean) {
    this._PendingVoiceConnection = PVC;
  }

  public get PendingVoiceServerDetails(): IDiscordVoiceServerGatewayEvent | undefined {
    return this._PendingVoiceServerDetails;
  }

  public set PendingVoiceServerDetails(PVSD: IDiscordVoiceServerGatewayEvent | undefined) {
    this._PendingVoiceServerDetails = PVSD;
  }

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
    this.PremiumTier = GuildObject.premium_tier;

    this.PremiumSubscriptionCount = GuildObject.premium_subscription_count ? GuildObject.premium_subscription_count : 0;
    this.Banner = GuildObject.banner === '' ? undefined : GuildObject.banner;
    this.Description = GuildObject.description === '' ? undefined : GuildObject.description;
    this.VanityURLCode = GuildObject.vanity_url_code === '' ? undefined : GuildObject.vanity_url_code;
    this.MaxMembers = GuildObject.max_members;
    this.MaxPresences =
      GuildObject.max_presences === undefined || GuildObject.max_presences === null ? 5000 : GuildObject.max_presences;
    this.Channels = new ChannelStore(this.Client);
    if (GuildObject.channels) {
      this.ResolveChannels(GuildObject.channels);
    }
    this.Presences = new PresenceStore(this.Client);
    this.Members = new GuildMemberStore(this.Client);
    if (GuildObject.members) {
      this.ResolveMembersAndPresences(GuildObject.members, GuildObject.presences);
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
    this.ApplicationId = GuildObject.application_id;
    this.EmbedChannelId = GuildObject.embed_channel_id === null ? undefined : GuildObject.embed_channel_id;
    this.EmbedEnabled = GuildObject.embed_enabled;
    this.AfkChannelId = GuildObject.afk_channel_id === null ? undefined : GuildObject.afk_channel_id;
    this.Permissions = GuildObject.permissions;
    this.Owner = GuildObject.owner;
    this.Icon = GuildObject.icon;
    this.Splash = GuildObject.splash;
  }

  /**
   * Creates a new voice connection for this guild
   * @param Token - token provided as part of the voice server update event payload
   * @param Endpoint - endpoint provided as part of the voice server update event payload
   */
  public CreateVoiceConnection(Token: string, Endpoint: string): Promise<VoiceManager> {
    return new Promise((resolve, reject) => {
      if (this.Client.User) {
        const RelevantVoiceState: VoiceState = this.VoiceStates.Get(this.Client.User.id);
        if (RelevantVoiceState && RelevantVoiceState.SessionId) {
          const NewVoiceConnection: VoiceConnection = new VoiceConnection(
            this.Client,
            this,
            Token,
            Endpoint,
            RelevantVoiceState.SessionId,
          );
          NewVoiceConnection.on('VOICE_READY', () => {
            resolve(new VoiceManager(this.Client, NewVoiceConnection));
          });
          NewVoiceConnection.Connect();
        } else {
          reject(new Error('No Relevant Voice State Found'));
        }
      } else {
        reject(new Error('Client has no User'));
      }
    });
  }

  /**
   * Carry out actions on this guild (these will call Discords REST API)
   */
  public Actions(): GuildActions {
    return new GuildActions(this.Client, this);
  }

  private ResolveVoiceStates(VoiceStates: IDiscordVoiceState[]): void {
    for (const voiceState of VoiceStates) {
      const NewVoiceState: VoiceState = new VoiceState(this.Client, voiceState, this);
      this.VoiceStates.AddVoiceState(NewVoiceState);
    }
  }

  private ResolvePresences(presences: IDiscordPresenceUpdate[]): void {
    for (const presence of presences) {
      presence.guild_id = this.id;
      const NewPresence = new Presence(this.Client, presence);
      this.Presences.AddPresence(NewPresence);
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

  private ResolveMembersAndPresences(members: IDiscordGuildMember[], presences?: IDiscordPresenceUpdate[]): void {
    for (const member of members) {
      this.Members.AddGuildMember(new GuildMember(member));
    }
    // presences need to be resolved after members
    if (presences) {
      this.ResolvePresences(presences);
    }
  }

  private ResolveChannels(channels: IDiscordChannel[]): void {
    for (const channel of channels) {
      if (channel.type === CHANNEL_TYPES.GUILD_TEXT) {
        this.Channels.AddTextChannel(new TextChannel(this.Client, channel, this));
      } else if (channel.type === CHANNEL_TYPES.GUILD_VOICE) {
        this.Channels.AddVoiceChannel(new VoiceChannel(this.Client, channel, this));
      } else if (channel.type === CHANNEL_TYPES.GUILD_CATEGORY) {
        this.Channels.AddChannelCategory(new CategoryChannel(this.Client, channel, this));
      }
    }
  }
}
