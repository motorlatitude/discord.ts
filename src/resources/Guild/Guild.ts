import CHANNEL_TYPES from '../../common/constants/channeltypes';
import {
  IDiscordAuditLog,
  IDiscordBan,
  IDiscordChannel,
  IDiscordEmbed,
  IDiscordEmoji,
  IDiscordGuild,
  IDiscordGuildMember,
  IDiscordHTTPResponse,
  IDiscordIntegration,
  IDiscordInvite,
  IDiscordPresenceUpdate,
  IDiscordPruneCount,
  IDiscordRole,
  IDiscordVanityURL,
  IDiscordVoiceRegion,
  IDiscordVoiceServerGatewayEvent,
  IDiscordVoiceState,
} from '../../common/types';
import {
  IEndpointAuditOptions,
  IEndpointChannelObject,
  IEndpointGuildEmbedObject,
  IEndpointGuildMemberObject,
  IEndpointGuildRole,
  IEndpointIntegrationObject,
  IEndpointModifyIntegrationObject,
} from '../../common/types/GuildEndpoint.types';
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
import GuildChannelActions from './Actions/GuildChannelActions';
import GuildMemberActions from './Actions/GuildMemberActions';
import GuildUserActions from './Actions/GuildUserActions';
import Emoji from './Emoji';
import GuildMember from './GuildMember';
import Role from './Role';
import GuildBanActions from './Actions/GuildBanActions';

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

  public VoiceConnection?: VoiceConnection;
  public PendingVoiceConnection?: boolean;
  public PendingVoiceServerDetails?: IDiscordVoiceServerGatewayEvent;

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

  private readonly Client: DiscordClient;

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
    this.EmbedChannelId = GuildObject.embed_channel_id;
    this.EmbedEnabled = GuildObject.embed_enabled;
    this.AfkChannelId = GuildObject.afk_channel_id;
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
   * Carry out actions on this guild
   */
  public Actions(): GuildActions {
    return new GuildActions(this.Client, this);
  }

  /**
   * Carry out channel actions on this guild
   */
  public ChannelActions(): GuildChannelActions {
    return new GuildChannelActions(this.Client, this);
  }

  /**
   * Carry out member actions on this guild
   */
  public MemberActions(): GuildMemberActions {
    return new GuildMemberActions(this.Client, this);
  }

  /**
   * Carry out user actions on this guild
   */
  public UserActions(): GuildUserActions {
    return new GuildUserActions(this.Client, this);
  }

  /**
   * Carry out ban actions on this guild
   */
  public BanActions():GuildBanActions {
    return new GuildBanActions(this.Client, this);
  }

  /**
   * Get roles in this guild
   */
  public GetRoles(): Promise<IDiscordRole[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildRoles(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Creates a new role in this guild
   * @param NewGuildRole - role object containing the new role's properties
   */
  public CreateRole(NewGuildRole: IEndpointGuildRole): Promise<IDiscordRole> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .CreateGuildRole(this.id, NewGuildRole)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Gets number of people that would be pruned
   * @param Days - number of days to count prune for
   */
  public GetPruneCount(Days: number = 1): Promise<IDiscordPruneCount> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildPruneCount(this.id, Days)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Start guild prune
   * @param Days - number of days to count prune for
   * @param ComputePruneCount - compute the number of people pruned, recommended false for large guilds
   */
  public Prune(Days: number, ComputePruneCount: boolean = false): Promise<IDiscordPruneCount> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .BeginGuildPrune(this.id, Days, ComputePruneCount)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * List available voice regions for this server
   */
  public GetVoiceRegions(): Promise<IDiscordVoiceRegion[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildVoiceRegions(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * List available invites for this guild
   */
  public GetInvites(): Promise<IDiscordInvite[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildInvites(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * List a guilds integrations
   */
  public GetIntegrations(): Promise<IDiscordIntegration[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildIntegrations(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Attach an integration object from the current user to the guild
   * @param NewIntegrationObject - required object containing type and integration id
   */
  public CreateIntegration(NewIntegrationObject: IEndpointIntegrationObject): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .CreateGuildIntegration(this.id, NewIntegrationObject)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Modify an existing integration in the guild
   * @param IntegrationId - the id of the integration to modify
   * @param IntegrationModifyObject - modify parameters, object containing expire_behaviour
   */
  public ModifyIntegration(
    IntegrationId: string,
    IntegrationModifyObject: IEndpointModifyIntegrationObject,
  ): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ModifyGuildIntegration(this.id, IntegrationId, IntegrationModifyObject)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Delete an attached integration
   * @param IntegrationId - the id of the integration to delete
   */
  public DeleteIntegration(IntegrationId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .DeleteGuildIntegration(this.id, IntegrationId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Sync an attached integration
   * @param IntegrationId - the id of integration to sync
   */
  public SyncIntegration(IntegrationId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .SyncGuildIntegration(this.id, IntegrationId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Get this guilds embed
   */
  public GetEmbed(): Promise<IDiscordEmbed> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildEmbed(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Modify the guild embed
   * @param NewGuildEmbed - the altered properties of the embed
   */
  public ModifyEmbed(NewGuildEmbed: IEndpointGuildEmbedObject): Promise<IDiscordEmbed> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ModifyGuildEmbed(this.id, NewGuildEmbed)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Get the vanity url for this guild
   */
  public VanityURL(): Promise<IDiscordVanityURL> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildVanityURL(this.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Fetch the audit log for this guild
   * @param Options - options to retrieve the audit log
   */
  public GetAuditLog(Options: IEndpointAuditOptions): Promise<IDiscordAuditLog> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().AuditMethods().GetGuildAuditLog(this.id, Options).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    })
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
