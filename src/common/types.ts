import CategoryChannel from '../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../resources/Channel/DirectMessageChannel';
import TextChannel from '../resources/Channel/TextChannel';
import VoiceChannel from '../resources/Channel/VoiceChannel';
import Emoji from '../resources/Guild/Emoji';
import Guild from '../resources/Guild/Guild';
import GuildMember from '../resources/Guild/GuildMember';
import User from '../resources/User/User';

export interface IDiscordClientOptions {
  token: string;
  debug?: string;
}

export interface IDiscordHTTPResponse {
  httpResponse: any;
  body: any;
  statusCode?: number;
  statusMessage?: string;
}

export interface IGatewayResponse {
  url: string;
  ping: number;
}

// Discord Resource Interfaces

export interface IDiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: IDiscordUser[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: number;
}

export interface IDiscordGuild {
  id: string;
  name: string;
  icon?: string;
  splash?: string;
  owner?: boolean;
  owner_id: string;
  permissions?: number;
  region: string;
  afk_channel_id?: string;
  afk_timeout: number;
  embed_enabled?: boolean;
  embed_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: IDiscordRole[];
  emojis: IDiscordEmoji[];
  features: string[];
  mfa_level: number;
  application_id?: string;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  system_channel_id?: string;
  joined_at?: number;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  voice_states?: any[]; // TODO
  members?: IDiscordGuildMember[];
  channels?: IDiscordChannel[];
  presences?: any[]; // TODO
  max_presences?: number;
  max_members: number;
  vanity_url_code?: string;
  description?: string;
  banner?: string;
  premium_tier: number;
  premium_subscription_count?: number;
}

export interface IDiscordGuildMember {
  user: IDiscordUser;
  nick?: string;
  roles: string[];
  joined_at: number;
  premium_since?: number;
  deaf: boolean;
  mute: boolean;
}

export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
}

export interface IDiscordEmoji {
  id: string;
  name: string;
  roles?: string[];
  user?: IDiscordUser;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
}

export interface IDiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: number;
  managed: boolean;
  mentionable: boolean;
}

// Discord Gateway Interfaces

export interface IDefaultDiscordGatewayPackage {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export interface IDiscordHelloPackage {
  heartbeat_interval: number;
  _trace: string[];
}

export interface IDiscordDispatchDataPackage {
  s: number;
  t: string;
  d: any;
}

export interface IDiscordUnavailableGuildObject {
  id: string;
  unavailable?: boolean;
}

// Discord Gateway Event Interfaces

export interface IDiscordReadyGatewayEvent {
  v: number;
  user: IDiscordUser;
  private_channels: [];
  guilds: IDiscordUnavailableGuildObject[];
  session_id: string;
  _trace: string[];
  shard?: number[];
}

export interface IDiscordChannelPinsUpdateGatewayEvent {
  channel_id: string;
  guild_id?: string;
  last_pin_timestamp?: number;
}

export interface IDiscordGuildBanGatewayEvent {
  guild_id: string;
  user: IDiscordUser;
}

export interface IDiscordGuildEmojiUpdateGatewayEvent {
  guild_id: string;
  emojis: IDiscordEmoji[];
}

export interface IDiscordGuildIntegrationUpdateGatewayEvent {
  guild_id: string;
}

export interface IDiscordGuildMemberAddGatewayEvent extends IDiscordGuildMember {
  guild_id: string;
}

export interface IDiscordGuildMemberRemoveGatewayEvent {
  guild_id: string;
  user: IDiscordUser;
}

export interface IDiscordGuildMemberUpdateGatewayEvent {
  guild_id: string;
  roles: string[];
  user: IDiscordUser;
  nick: string;
}

export interface IDiscordGuildMembersChunkGatewayEvent {
  guild_id: string;
  members: IDiscordGuildMember[];
}

// discordts Event objects

export interface IChannelDeleteEventObject {
  Id: string;
  Type: number;
}

export interface IChannelPinsUpdateEventObject {
  LastPinTimestamp?: number;
  Channel: TextChannel | DirectMessageChannel;
  Guild?: Guild;
}

export interface IGuildDeleteEventObject {
  id: string;
  Unavailable?: boolean;
  WasRemoved: boolean;
}

export interface IGuildBanEventObject {
  Guild: Guild;
  User: User;
}

export interface IGuildEmojisUpdateEventObject {
  Guild: Guild;
  Emojis: Emoji[];
}

export interface IGuildMemberEventObject {
  Guild: Guild;
  GuildMember: GuildMember;
}

export interface IGuildMembersChunkEventObject {
  Guild: Guild;
  GuildMembers: GuildMember[];
}

// Stores

export interface IGuildMemberList {
  [UserId: string]: GuildMember;
}

export interface IGuildBannedMember {
  Reason?: string;
  User: User;
}

export type IChannel = TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel;
