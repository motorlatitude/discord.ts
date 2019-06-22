import CategoryChannel from '../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../resources/Channel/DirectMessageChannel';
import TextChannel from '../resources/Channel/TextChannel';
import VoiceChannel from '../resources/Channel/VoiceChannel';
import Guild from '../resources/Guild/Guild';
import GuildMember from '../resources/Guild/GuildMember';

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

export interface IDiscordMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: IDiscordUser;
  member?: IDiscordGuildMember; // TODO docs say partial??
  content: string;
  timestamp: number;
  edited_timestamp?: number;
  tts: boolean;
  mention_everyone: boolean;
  mentions: IDiscordUser[]; // TODO also has partial member field
  mention_roles: string[];
  attachments: IDiscordAttachment[];
  embeds: IDiscordEmbed[];
  reactions?: IDiscordReaction[];
  nonce?: string;
  pinned: boolean;
  webhook_id?: string;
  type: number; // TODO
  activity?: IDiscordMessageActivity;
  application?: IDiscordMessageApplication;
}

export interface IDiscordMessageApplication {
  id: string;
  cover_image?: string;
  description: string;
  icon?: string;
  name?: string;
}

export interface IDiscordMessageActivity {
  type: number; // TODO
  party_id?: string;
}

export interface IDiscordReaction {
  count: number;
  me: boolean;
  emoji: IDiscordPartialEmoji;
}

export interface IDiscordEmbed {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: number;
  color?: number;
  footer?: IDiscordEmbedFooter;
  image?: IDiscordEmbedImage;
  thumbnail?: IDiscordEmbedThumbnail;
  video?: IDiscordEmbedVideo;
  provider?: IDiscordEmbedProvider;
  author?: IDiscordEmbedAuthor;
  fields?: IDiscordEmbedField[];
}

export interface IDiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface IDiscordEmbedAuthor {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface IDiscordEmbedProvider {
  name?: string;
  url?: string;
}

export interface IDiscordEmbedVideo {
  url?: string;
  height?: number;
  width?: number;
}

export interface IDiscordEmbedThumbnail {
  url?: string;
  proxy_url?: string;
  width?: number;
  height?: number;
}

export interface IDiscordEmbedImage {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface IDiscordEmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface IDiscordAttachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number; // if image
  width?: number; // if image
}

export interface IDiscordPartialEmoji {
  id?: string;
  name: string;
}

export interface IDiscordActivity {
  name: string;
  type: number;
  url?: string;
  timestamps?: IDiscordActivityTimestamp;
  application_id?: string;
  details?: string;
  state?: string;
  party?: IDiscordParty;
  assets?: IDiscordAssets;
  secrets?: IDiscordSecrets;
  instance?: boolean;
  flags?: number;
}

export interface IDiscordSecrets {
  join?: string;
  spectate?: string;
  match?: string;
}

export interface IDiscordAssets {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

export interface IDiscordParty {
  id?: string;
  size: [number, number];
}

export interface IDiscordActivityTimestamp {
  start?: number;
  end?: number;
}

export interface IDiscordClientStatus {
  desktop?: string;
  mobile?: string;
  web?: string;
}

export interface IDiscordPresenceUpdate {
  user: IDiscordUser;
  roles: string[];
  game?: IDiscordActivity;
  guild_id: string;
  status: string;
  activities: IDiscordActivity[];
  client_status: IDiscordClientStatus;
}

export interface IDiscordVoiceState {
  guild_id?: string;
  channel_id?: string;
  user_id: string;
  member?: IDiscordGuildMember;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  suppress: boolean;
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

export interface IDiscordGuildRoleEvent {
  guild_id: string;
  role?: IDiscordRole;
  role_id?: string;
}

export interface IDiscordMessageUpdateGatewayEvent {
  id: string;
  channel_id: string;
  guild_id?: string;
  author?: IDiscordUser;
  member?: IDiscordGuildMember; // TODO docs say partial??
  content?: string;
  timestamp?: number;
  edited_timestamp?: number;
  tts?: boolean;
  mention_everyone?: boolean;
  mentions?: IDiscordUser[]; // TODO also has partial member field
  mention_roles?: string[];
  attachments?: IDiscordAttachment[];
  embeds?: IDiscordEmbed[];
  reactions?: IDiscordReaction[];
  nonce?: string;
  pinned?: boolean;
  webhook_id?: string;
  type?: number; // TODO
  activity?: IDiscordMessageActivity;
  application?: IDiscordMessageApplication;
}

export interface IDiscordMessageDeleteGatewayEvent {
  id?: string;
  ids?: string[];
  channel_id: string;
  guild_id?: string;
}

export interface IDiscordMessageReactionGatewayEvent {
  user_id?: string;
  channel_id: string;
  message_id: string;
  guild_id?: string;
  emoji: IDiscordPartialEmoji;
}

export interface IDiscordTypingStartGatewayEvent {
  channel_id: string;
  guild_id?: string;
  user_id: string;
  timestamp: number;
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

// Stores

export interface IGuildMemberList {
  [UserId: string]: GuildMember;
}

export type IChannel = TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel;
