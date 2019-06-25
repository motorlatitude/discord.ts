import * as events from 'events';
import ClientConnection from './client/ClientConnection';
import Logger from './common/Logger';
import {
  IChannelDeleteEventObject,
  IChannelPinsUpdateEventObject,
  IDiscordClientOptions,
  IGatewayResponse,
  IGuildDeleteEventObject,
} from './common/types';
import CategoryChannel from './resources/Channel/CategoryChannel';
import DirectMessageChannel from './resources/Channel/DirectMessageChannel';
import TextChannel from './resources/Channel/TextChannel';
import VoiceChannel from './resources/Channel/VoiceChannel';
import Emoji from './resources/Guild/Emoji';
import Guild from './resources/Guild/Guild';
import GuildMember from './resources/Guild/GuildMember';
import Role from './resources/Guild/Role';
import Message from './resources/Message/Message';
import ReactionEmoji from './resources/Message/ReactionEmoji';
import Presence from './resources/User/Presence';
import User from './resources/User/User';
import VoiceState from './resources/Voice/VoiceState';
import DiscordManager from './rest/DiscordManager';
import ChannelStore from './stores/ChannelStore';
import GuildStore from './stores/GuildStore';
import VoiceStateStore from './stores/VoiceStateStore';
import VoiceManager from './voice/VoiceManager';

/**
 * ## DiscordClient
 *
 * Represents DiscordClient Class and Entry Point For discord.ts
 */
export class DiscordClient extends events.EventEmitter {
  /**
   * @param token - Discord API Token
   */
  public readonly token: string;

  /**
   * @param gateway - Discord Gateway Websocket URL
   */
  public gateway: string | undefined;

  /**
   * @param Guilds - All available guilds
   */
  public Guilds: GuildStore;

  /**
   * @param Channels - All available DM channels, allows for the modifying and retrieval of channels
   */
  public Channels: ChannelStore;

  /**
   * @param User - The current user object. This is only available once the connection has successfully been
   * carried out and the READY event has been sent
   */
  public User?: User;

  /**
   * @param VoiceStates - The current users voice states for direct messaging channels
   */
  public VoiceStates: VoiceStateStore;

  /**
   * @param DiscordAPIManager - Access To Discord APIs REST methods
   */
  public DiscordAPIManager: DiscordManager;

  /**
   * @param connect - Our Connection with the Discord Gateway Websocket Server
   */
  public Connection?: ClientConnection;

  /**
   * @param logger - For writing logs
   */
  public logger: Logger;

  /**
   * Create DiscordClient Object
   * @param options - pass options, this must include a token
   */
  constructor(options: IDiscordClientOptions) {
    super();

    this.token = options.token;

    this.logger = new Logger();

    this.logger.write().info({
      message: 'Using DiscordTS (version: ' + require('./../package.json').version + ')',
      service: 'DiscordClient',
    });

    this.Channels = new ChannelStore(this);
    this.Guilds = new GuildStore(this);
    this.VoiceStates = new VoiceStateStore(this);

    this.DiscordAPIManager = new DiscordManager(this.token);
  }

  /**
   * Retrieve Gateway URL and Connect To Discords Gateway Server
   */
  public Connect(): void {
    this.DiscordAPIManager.Methods()
      .GatewayMethods()
      .GatewayForBot()
      .then((response: IGatewayResponse) => {
        const gatewayUrl: string = response.url;
        const ping: number = response.ping;

        this.gateway = gatewayUrl;

        this.logger.write().info({
          message: 'Successfully Found Gateway Server: ' + gatewayUrl + ' (' + ping + 'ms)',
          service: 'DiscordClient.connect',
        });
        this.emit('GATEWAY_FOUND', gatewayUrl);

        this.EstablishGatewayConnection(gatewayUrl);
      })
      .catch((err: any) => {
        this.logger.write().error({
          message: err,
          service: 'DiscordClient.connect',
        });
        this.emit('DISCONNECT');
      });
  }

  /**
   * Close the connection
   */
  public Disconnect(): void {
    if (this.Connection) {
      this.Connection.Disconnect();
    }
  }

  /**
   * Establish a connection to discords gateway server
   * @param url - gateway server url
   */
  private EstablishGatewayConnection(url: string): void {
    this.Connection = new ClientConnection(this);
    this.Connection.Connect(url);
  }
}

// Other Exports For Easy Access

export { User, Guild };

// tslint:disable-next-line:interface-name
export declare interface DiscordClient {
  /**
   * ### READY Event
   *
   * Event is emitted once the client has successfully connected to discord api gateway server and will return a [[IReadyEventObject]]
   * @event READY
   */
  on(event: 'READY', listener: (User: User) => void): this;

  /**
   * ### RESUMED Event
   *
   * Event is emitted if the connection was lost and successfully resumed, it denotes the end of missed payloads
   * @event RESUMED
   */
  on(event: 'RESUMED', listener: () => void): this;

  /**
   * ### CHANNEL_CREATE Event
   *
   * Event is emitted if a new channel has been created in a guild that the client is connected to
   * @event CHANNEL_CREATE
   */
  on(
    event: 'CHANNEL_CREATE',
    listener: (Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel) => void,
  ): this;

  /**
   * ### CHANNEL_UPDATE Event
   *
   * Event is emitted if a channel has been updated in a guild that the client is connected to
   * @event CHANNEL_UPDATE
   */
  on(
    // tslint:disable-next-line:unified-signatures
    event: 'CHANNEL_UPDATE',
    listener: (Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel) => void,
  ): this;

  /**
   * ### CHANNEL_DELETE Event
   *
   * Event is emitted if a channel has been deleted in a guild that the client is connected to and will not
   * return a full Channel, instead will return [[IChannelDeleteEventObject]]
   * @event CHANNEL_DELETE
   */
  on(event: 'CHANNEL_DELETE', listener: (Channel: IChannelDeleteEventObject) => void): this;

  /**
   * ### CHANNEL_PINS_UPDATE Event
   *
   * Event is emitted if a message has been pinned or unpinned in a text or direct message channel. Not sent when
   * a pinned message is deleted
   * @event CHANNEL_PINS_UPDATE
   */
  on(event: 'CHANNEL_PINS_UPDATE', listener: (ChannelPinUpdate: IChannelPinsUpdateEventObject) => void): this;

  /**
   * ### GUILD_CREATE Event
   *
   * Event is emitted if the bot joins a new guild, also emitted during lazy load during initial connection
   * @event GUILD_CREATE
   */
  on(event: 'GUILD_CREATE', listener: (Guild: Guild) => void): this;

  /**
   * ### GUILD_UPDATE Event
   *
   * Event is emitted if a guild that the bot is a member of was updated
   * @event GUILD_UPDATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_UPDATE', listener: (Guild: Guild) => void): this;

  /**
   * ### GUILD_DELETE Event
   *
   * Event is emitted if a guild that the bot is a member of was removed either due to a server
   * disconnect / unavailability or the bot was kicked. Will not return a full Guild instead
   * will return [[IGuildDeleteEventObject]]
   * @event GUILD_DELETE
   */
  on(event: 'GUILD_DELETE', listener: (DeletedGuild: IGuildDeleteEventObject) => void): this;

  /**
   * ### GUILD_BAN_ADD Event
   *
   * Event is emitted if a member is banned from a guild that the bot is a member of
   * @event GUILD_BAN_ADD
   */
  on(event: 'GUILD_BAN_ADD', listener: (Guild: Guild, User: User) => void): this;

  /**
   * ### GUILD_BAN_REMOVE Event
   *
   * Event is emitted if a member is unbanned from a guild that the bot is a member of
   * @event GUILD_BAN_ADD
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_BAN_REMOVE', listener: (Guild: Guild, User: User) => void): this;

  /**
   * ### GUILD_EMOJIS_UPDATE Event
   *
   * Event is emitted if an emoji in a joined guild has been updated
   * @event GUILD_EMOJIS_UPDATE
   */
  on(event: 'GUILD_EMOJIS_UPDATE', listener: (Guild: Guild, Emojis: Emoji[]) => void): this;

  /**
   * ### GUILD_INTEGRATION_UPDATE Event
   *
   * Event is emitted if when a guild integration is updated
   * @event GUILD_INTEGRATION_UPDATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_INTEGRATION_UPDATE', listener: (Guild: Guild) => void): this;

  /**
   * ### GUILD_MEMBER_ADD Event
   *
   * Event is emitted if a new member joins a guild that the bot is a part of
   * @event GUILD_MEMBER_ADD
   */
  on(event: 'GUILD_MEMBER_ADD', listener: (Guild: Guild, GuildMember: GuildMember) => void): this;

  /**
   * ### GUILD_MEMBER_REMOVE Event
   *
   * Event is emitted if a member leaves a guild that the bot is part of (leave/kick/ban).
   * @event GUILD_MEMBER_REMOVE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_MEMBER_REMOVE', listener: (Guild: Guild, GuildMember: GuildMember) => void): this;

  /**
   * ### GUILD_MEMBER_UPDATE Event
   *
   * Event is emitted if a member is updated in a guild that the bot is part of
   * @event GUILD_MEMBER_UPDATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_MEMBER_UPDATE', listener: (Guild: Guild, GuildMember: GuildMember) => void): this;

  /**
   * ### GUILD_MEMBERS_CHUNK Event
   *
   * Sent in response to Guild Request Members.
   * @event GUILD_MEMBERS_CHUNK
   */
  on(event: 'GUILD_MEMBERS_CHUNK', listener: (Guild: Guild, GuildMembers: GuildMember[]) => void): this;

  /**
   * ### GUILD_ROLE_CREATE Event
   *
   * Event is emitted if a role is created in a guild that the bot is a member of
   * @event GUILD_ROLE_CREATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_ROLE_CREATE', listener: (Guild: Guild, Role: Role) => void): this;

  /**
   * ### GUILD_ROLE_UPDATE Event
   *
   * Event is emitted if a role is updated in a guild that the bot is a member of
   * @event GUILD_ROLE_UPDATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_ROLE_UPDATE', listener: (Guild: Guild, Role: Role) => void): this;

  /**
   * ### GUILD_ROLE_DELETE Event
   *
   * Event is emitted if a role is deleted in a guild that the bot is a member of, the role passed
   * in response will no longer exist as part of the Guild
   * @event GUILD_ROLE_DELETE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'GUILD_ROLE_DELETE', listener: (Guild: Guild, Role: Role) => void): this;

  /**
   * ### MESSAGE_CREATE Event
   *
   * Event is emitted if a new message is sent in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
   * @event MESSAGE_CREATE
   */
  on(
    event: 'MESSAGE_CREATE',
    listener: (
      MessageObject: Message,
      ChannelObject: TextChannel | DirectMessageChannel,
      Author: User,
      GuildObject?: Guild,
      GuildMemberObject?: GuildMember,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_UPDATE Event
   *
   * Event is emitted if a message is updated in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
   * @event MESSAGE_UPDATE
   */
  on(
    // tslint:disable-next-line:unified-signatures
    event: 'MESSAGE_UPDATE',
    listener: (
      MessageObject: Message,
      ChannelObject: TextChannel | DirectMessageChannel,
      Author: User,
      GuildObject?: Guild,
      GuildMemberObject?: GuildMember,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_DELETE Event
   *
   * Event is emitted if a message is deleted in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
   * @event MESSAGE_DELETE
   */
  on(
    // tslint:disable-next-line:unified-signatures
    event: 'MESSAGE_DELETE',
    listener: (
      MessageObject: Message,
      ChannelObject: TextChannel | DirectMessageChannel,
      Author: User,
      GuildObject?: Guild,
      GuildMemberObject?: GuildMember,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_DELETE_BULK Event
   *
   * Event is emitted if multiple messages are deleted at one in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
   * @event MESSAGE_DELETE_BULK
   */
  on(
    event: 'MESSAGE_DELETE_BULK',
    listener: (
      MessageObjects: Message[],
      ChannelObject: TextChannel | DirectMessageChannel,
      GuildObject?: Guild,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_REACTION_ADD Event
   *
   * Event is emitted if a message has a reaction added
   * @event MESSAGE_REACTION_ADD
   */
  on(
    event: 'MESSAGE_REACTION_ADD',
    listener: (
      Channel: TextChannel | DirectMessageChannel,
      MessageId: string,
      Emoji: ReactionEmoji,
      User: User,
      Guild?: Guild,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_REACTION_REMOVE Event
   *
   * Event is emitted if a message has a reaction added
   * @event MESSAGE_REACTION_REMOVE
   */
  on(
    // tslint:disable-next-line:unified-signatures
    event: 'MESSAGE_REACTION_REMOVE',
    listener: (
      Channel: TextChannel | DirectMessageChannel,
      MessageId: string,
      Emoji: ReactionEmoji,
      User: User,
      Guild?: Guild,
    ) => void,
  ): this;

  /**
   * ### MESSAGE_REACTION_REMOVE_ALL Event
   *
   * Event is emitted if a message has a reaction added
   * @event MESSAGE_REACTION_REMOVE_ALL
   */
  on(
    event: 'MESSAGE_REACTION_REMOVE_ALL',
    listener: (Channel: TextChannel | DirectMessageChannel, MessageId: string, Guild?: Guild) => void,
  ): this;

  /**
   * ### PRESENCE_UPDATE
   *
   * Event is emitted when a user's presence or info, such as name or avatar, is updated.
   * @event PRESENCE_UPDATE
   */
  on(event: 'PRESENCE_UPDATE', listener: (NewPresence: Presence, OldPresence?: Presence) => void): this;

  /**
   * ### TYPING_START
   *
   * Sent when a user starts typing in a channel
   * @event TYPING_START
   */
  on(
    event: 'TYPING_START',
    listener: (Channel: TextChannel | DirectMessageChannel, User: User, Timestamp: number, Guild?: Guild) => void,
  ): this;

  /**
   * ### USER_UPDATE Event
   *
   * Event is emitted if properties of the current user change
   * @event USER_UPDATE
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'USER_UPDATE', listener: (User: User) => void): this;

  /**
   * ### VOICE_STATE_UPDATE
   *
   * Event is emitted when someone joins/leaves/moves voice channels
   * @event VOICE_STATE_UPDATE
   */
  on(
    event: 'VOICE_STATE_UPDATE',
    listener: (EventType: 'JOINED' | 'UPDATED' | 'LEFT', VoiceState: VoiceState) => void,
  ): this;

  /**
   * ### VOICE_SERVER_UPDATE
   *
   * Sent when a guild's voice server is updated. This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.
   * @event VOICE_SERVER_UPDATE
   */
  on(event: 'VOICE_SERVER_UPDATE', listener: (VoiceConnection: VoiceManager) => void): this;

  /**
   * ### WEBHOOKS_UPDATE Event
   *
   * Event is emitted when a guild channel's webhook is created, updated, or deleted.
   * @event WEBHOOKS_UPDATE
   */
  on(event: 'WEBHOOKS_UPDATE', listener: (Channel: TextChannel, Guild: Guild) => void): this;

  /**
   * ### GATEWAY_FOUND Event
   *
   * Event is emitted if the client has successfully determined the Discord Websocket URL
   * @event GATEWAY_FOUND
   */
  on(event: 'GATEWAY_FOUND', listener: (GatewayUrl: string) => void): this;

  /**
   * ### DISCONNECT Event
   *
   * Event is emitted if the client was disconnected from the Discord Websocket Server
   * @event DISCONNECT
   */
  // tslint:disable-next-line:unified-signatures
  on(event: 'DISCONNECT', listener: () => void): this;

  emit(event: 'READY' | 'USER_UPDATE', User: User): boolean;
  emit(
    event: 'CHANNEL_CREATE' | 'CHANNEL_UPDATE',
    Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel,
  ): boolean;
  emit(event: 'CHANNEL_DELETE', Channel: IChannelDeleteEventObject): boolean;
  emit(event: 'CHANNEL_PINS_UPDATE', ChannelPin: IChannelPinsUpdateEventObject): boolean;
  emit(event: 'GUILD_CREATE' | 'GUILD_UPDATE' | 'GUILD_INTEGRATION_UPDATE', Guild: Guild): boolean;
  emit(event: 'GUILD_DELETE', DeletedGuild: IGuildDeleteEventObject): boolean;
  emit(event: 'GUILD_BAN_ADD' | 'GUILD_BAN_REMOVE', Guild: Guild, User: User): boolean;
  emit(event: 'GUILD_EMOJIS_UPDATE', Guild: Guild, Emojis: Emoji[]): boolean;
  emit(
    event: 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_REMOVE' | 'GUILD_MEMBER_UPDATE',
    Guild: Guild,
    GuildMember: GuildMember,
  ): boolean;
  emit(event: 'GUILD_MEMBERS_CHUNK', Guild: Guild, GuildMembers: GuildMember[]): boolean;
  emit(event: 'GUILD_ROLE_CREATE' | 'GUILD_ROLE_UPDATE' | 'GUILD_ROLE_DELETE', Guild: Guild, Role: Role): boolean;
  emit(
    event: 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE',
    MessageObject: Message,
    ChannelObject: TextChannel | DirectMessageChannel,
    Author: User,
    GuildObject?: Guild,
    GuildMemberObject?: GuildMember,
  ): boolean;
  emit(
    event: 'MESSAGE_DELETE_BULK',
    MessageObjects: Message[],
    ChannelObject: TextChannel | DirectMessageChannel,
    GuildObject?: Guild,
  ): boolean;
  emit(
    event: 'MESSAGE_REACTION_ADD' | 'MESSAGE_REACTION_REMOVE',
    Channel: TextChannel | DirectMessageChannel,
    MessageId: string,
    Emoji: ReactionEmoji,
    User: User,
    Guild?: Guild,
  ): boolean;
  emit(
    event: 'MESSAGE_REACTION_REMOVE_ALL',
    Channel: TextChannel | DirectMessageChannel,
    MessageId: string,
    Guild?: Guild,
  ): boolean;
  emit(event: 'PRESENCE_UPDATE', NewPresence: Presence, OldPresence?: Presence): boolean;
  emit(
    event: 'TYPING_START',
    Channel: TextChannel | DirectMessageChannel,
    User: User,
    Timestamp: number,
    Guild?: Guild,
  ): boolean;
  emit(event: 'VOICE_STATE_UPDATE', EventType: 'JOINED' | 'UPDATED' | 'LEFT', VoiceState: VoiceState): boolean;
  emit(event: 'VOICE_SERVER_UPDATE', VoiceConnection: VoiceManager): boolean;
  emit(event: 'WEBHOOKS_UPDATE', Channel: TextChannel, Guild: Guild): boolean;
  emit(event: 'GATEWAY_FOUND', GatewayUrl: string): boolean;
  emit(event: 'DISCONNECT' | 'RESUMED'): boolean;
  // emit(event: string | symbol, ...args: any[]): boolean;
}

export default DiscordClient;
