/// <reference types="node" />
import * as events from 'events';
import ClientConnection from './client/ClientConnection';
import Logger from './common/Logger';
import DiscordManager from './rest/DiscordManager';
import { IChannelDeleteEventObject, IChannelPinsUpdateEventObject, IDiscordClientOptions, IGuildDeleteEventObject } from './common/types';
import CategoryChannel from './resources/Channel/CategoryChannel';
import DirectMessageChannel from './resources/Channel/DirectMessageChannel';
import TextChannel from './resources/Channel/TextChannel';
import VoiceChannel from './resources/Channel/VoiceChannel';
import Emoji from './resources/Guild/Emoji';
import Guild from './resources/Guild/Guild';
import GuildMember from './resources/Guild/GuildMember';
import Role from './resources/Guild/Role';
import Message from './resources/Message/Message';
import User from './resources/User/User';
import ChannelStore from './stores/ChannelStore';
import GuildStore from './stores/GuildStore';
/**
 * ## DiscordClient
 *
 * Represents DiscordClient Class and Entry Point For discord.ts
 */
export declare class DiscordClient extends events.EventEmitter {
    /**
     * @param token - Discord API Token
     */
    readonly token: string;
    /**
     * @param gateway - Discord Gateway Websocket URL
     */
    gateway: string | undefined;
    /**
     * @param Guilds - All available guilds
     */
    Guilds: GuildStore;
    /**
     * @param Channels - All available DM channels, allows for the modifying and retrieval of channels
     */
    Channels: ChannelStore;
    /**
     * @param User - The current user object. This is only available once the connection has successfully been
     * carried out and the READY event has been sent
     */
    User?: User;
    /**
     * @param rest - Access To Discord APIs REST methods
     */
    rest: DiscordManager;
    /**
     * @param connect - Our Connection with the Discord Gateway Websocket Server
     */
    Connection?: ClientConnection;
    /**
     * @param logger - For writing logs
     */
    logger: Logger;
    /**
     * Create DiscordClient Object
     * @param options - pass options, this must include a token
     */
    constructor(options: IDiscordClientOptions);
    /**
     * Retrieve Gateway URL and Connect To Discords Gateway Server
     */
    connect(): void;
    /**
     * Establish a connection to discords gateway server
     * @param url - gateway server url
     */
    private EstablishGatewayConnection;
}
export { User, Guild };
export declare interface DiscordClient {
    /**
     * ### READY Event
     *
     * Event is emitted once the client has successfully connected to discord api gateway server and will return a [[IReadyEventObject]]
     * @event READY
     */
    on(event: 'READY', listener: (User: User) => void): this;
    /**
     * ### CHANNEL_CREATE Event
     *
     * Event is emitted if a new channel has been created in a guild that the client is connected to
     * @event CHANNEL_CREATE
     */
    on(event: 'CHANNEL_CREATE', listener: (Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel) => void): this;
    /**
     * ### CHANNEL_UPDATE Event
     *
     * Event is emitted if a channel has been updated in a guild that the client is connected to
     * @event CHANNEL_UPDATE
     */
    on(event: 'CHANNEL_UPDATE', listener: (Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel) => void): this;
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
    on(event: 'GUILD_MEMBER_REMOVE', listener: (Guild: Guild, GuildMember: GuildMember) => void): this;
    /**
     * ### GUILD_MEMBER_UPDATE Event
     *
     * Event is emitted if a member is updated in a guild that the bot is part of
     * @event GUILD_MEMBER_UPDATE
     */
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
    on(event: 'GUILD_ROLE_CREATE', listener: (Guild: Guild, Role: Role) => void): this;
    /**
     * ### GUILD_ROLE_UPDATE Event
     *
     * Event is emitted if a role is updated in a guild that the bot is a member of
     * @event GUILD_ROLE_UPDATE
     */
    on(event: 'GUILD_ROLE_UPDATE', listener: (Guild: Guild, Role: Role) => void): this;
    /**
     * ### GUILD_ROLE_DELETE Event
     *
     * Event is emitted if a role is deleted in a guild that the bot is a member of, the role passed
     * in response will no longer exist as part of the Guild
     * @event GUILD_ROLE_DELETE
     */
    on(event: 'GUILD_ROLE_DELETE', listener: (Guild: Guild, Role: Role) => void): this;
    /**
     * ### MESSAGE_CREATE Event
     *
     * Event is emitted if a new message is sent in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
     * @event MESSAGE_CREATE
     */
    on(event: 'MESSAGE_CREATE', listener: (MessageObject: Message, ChannelObject: TextChannel | DirectMessageChannel, Author: User, GuildObject?: Guild, GuildMemberObject?: GuildMember) => void): this;
    /**
     * ### MESSAGE_UPDATE Event
     *
     * Event is emitted if a message is updated in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
     * @event MESSAGE_UPDATE
     */
    on(event: 'MESSAGE_UPDATE', listener: (MessageObject: Message, ChannelObject: TextChannel | DirectMessageChannel, Author: User, GuildObject?: Guild, GuildMemberObject?: GuildMember) => void): this;
    /**
     * ### MESSAGE_DELETE Event
     *
     * Event is emitted if a message is deleted in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
     * @event MESSAGE_DELETE
     */
    on(event: 'MESSAGE_DELETE', listener: (MessageObject: Message, ChannelObject: TextChannel | DirectMessageChannel, Author: User, GuildObject?: Guild, GuildMemberObject?: GuildMember) => void): this;
    /**
     * ### MESSAGE_DELETE_BULK Event
     *
     * Event is emitted if multiple messages are deleted at one in a TextChannel in a guild the bot is a member of or in a DirectMessageChannel
     * @event MESSAGE_DELETE_BULK
     */
    on(event: 'MESSAGE_DELETE_BULK', listener: (MessageObjects: Message[], ChannelObject: TextChannel | DirectMessageChannel, GuildObject?: Guild) => void): this;
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
    on(event: 'DISCONNECT', listener: () => void): this;
    emit(event: 'READY', User: User): boolean;
    emit(event: 'CHANNEL_CREATE' | 'CHANNEL_UPDATE', Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel): boolean;
    emit(event: 'CHANNEL_DELETE', Channel: IChannelDeleteEventObject): boolean;
    emit(event: 'CHANNEL_PINS_UPDATE', ChannelPin: IChannelPinsUpdateEventObject): boolean;
    emit(event: 'GUILD_CREATE' | 'GUILD_UPDATE' | 'GUILD_INTEGRATION_UPDATE', Guild: Guild): boolean;
    emit(event: 'GUILD_DELETE', DeletedGuild: IGuildDeleteEventObject): boolean;
    emit(event: 'GUILD_BAN_ADD' | 'GUILD_BAN_REMOVE', Guild: Guild, User: User): boolean;
    emit(event: 'GUILD_EMOJIS_UPDATE', Guild: Guild, Emojis: Emoji[]): boolean;
    emit(event: 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_REMOVE' | 'GUILD_MEMBER_UPDATE', Guild: Guild, GuildMember: GuildMember): boolean;
    emit(event: 'GUILD_MEMBERS_CHUNK', Guild: Guild, GuildMembers: GuildMember[]): boolean;
    emit(event: 'GUILD_ROLE_CREATE' | 'GUILD_ROLE_UPDATE' | 'GUILD_ROLE_DELETE', Guild: Guild, Role: Role): boolean;
    emit(event: 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE', MessageObject: Message, ChannelObject: TextChannel | DirectMessageChannel, Author: User, GuildObject?: Guild, GuildMemberObject?: GuildMember): boolean;
    emit(event: 'MESSAGE_DELETE_BULK', MessageObjects: Message[], ChannelObject: TextChannel | DirectMessageChannel, GuildObject?: Guild): boolean;
    emit(event: 'GATEWAY_FOUND', GatewayUrl: string): boolean;
    emit(event: 'DISCONNECT'): boolean;
}
export default DiscordClient;