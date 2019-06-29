import CHANNEL_TYPES from '../../common/constants/channeltypes';
import {
  IDiscordBan,
  IDiscordChannel,
  IDiscordEmoji,
  IDiscordGuild,
  IDiscordGuildMember, IDiscordHTTPResponse,
  IDiscordPresenceUpdate,
  IDiscordRole,
  IDiscordVoiceServerGatewayEvent,
  IDiscordVoiceState,
} from '../../common/types';
import { IEndpointChannelObject, IEndpointGuildMemberObject } from '../../common/types/GuildEndpoint.types';
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
   * Modify this guild, this will call the API
   * @param Parameters - parameters to alter https://discordapp.com/developers/docs/resources/guild#modify-guild-json-params
   */
  public Modify(Parameters: any): Promise<IDiscordGuild> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().ModifyGuild(this.id, Parameters).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    });
  }

  /**
   * Deletes this guild, this will call the API
   */
  public Delete(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().DeleteGuild(this.id).then((Response: IDiscordHTTPResponse) => {
        resolve();
      }).catch((err) => {
        reject(err);
      })
    });
  }

  /**
   * Request Guild Channels, this will call the API
   */
  public GetChannels(): Promise<IDiscordChannel[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().GetGuildChannels(this.id).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    });
  }

  /**
   * Create a new channel in this guild, this will call the API
   * @param NewChannelObject - the new channel object
   */
  public CreateNewChannel(NewChannelObject: IEndpointChannelObject): Promise<IDiscordChannel> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().CreateGuildChannel(this.id, NewChannelObject).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get a specific guild member, this will call the API
   * @param UserId - the user id of the guild member to call
   */
  public GetMember(UserId: string): Promise<IDiscordGuildMember> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().GetGuildMember(this.id, UserId).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get all guild members
   * @constructor
   */
  public GetAllMembers(): Promise<IDiscordGuildMember[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().ListGuildMembers(this.id).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  /**
   * Add a new member to this guild
   * @param UserId - the user id of the user to add to the guild
   * @param GuildMemberObject - an object containing member information
   */
  public AddMember(UserId: string, GuildMemberObject: IEndpointGuildMemberObject): Promise<IDiscordGuildMember> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().AddGuildMember(this.id, UserId, GuildMemberObject).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Set the current users nickname in this guild
   * @param Nickname - the new nickname to use
   */
  public SetNick(Nickname: string): Promise<{nick: string}> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().ModifyCurrentUserNick(this.id, Nickname).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body)
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Remove a member from the guild
   * @param UserId - the user id of the member to be removed
   */
  public RemoveMember(UserId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().RemoveGuildMember(this.id, UserId).then((Response: IDiscordHTTPResponse) => {
        resolve();
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get all banned members for this guild
   */
  public GetBans(): Promise<IDiscordBan[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().GetGuildBans(this.id).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get ban for a specific user
   * @param UserId - the user id of the member that is banned
   */
  public GetBanForUser(UserId: string): Promise<IDiscordBan> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().GetGuildBan(this.id, UserId).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body);
      }).catch((err => {
        reject(err);
      }));
    });
  }

  /**
   * Unban a user that has been banned
   * @param UserId - the user id of the user to be unbanned
   */
  public UnbanUser(UserId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().RemoveGuildBan(this.id, UserId).then((Response: IDiscordHTTPResponse) => {
        resolve();
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get roles in this guild
   */
  public GetRoles(): Promise<IDiscordRole[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().GuildMethods().GetGuildRoles(this.id).then((Response: IDiscordHTTPResponse) => {
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
