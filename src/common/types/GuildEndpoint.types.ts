import { IDiscordRole } from '../types';

export interface IEndpointGuildObject {
  name: string;
  region: string;
  icon: string;
  verification_level: number;
  default_message_notification: number;
  explicit_content_filter: number;
  roles: IDiscordRole[];
  channels: IEndpointChannelObject[];
}

export interface IEndpointChannelObject {
  name: string;
  type?: number;
  topic?: string;
  bitrate: string;
  user_limit?: number;
  rate_limit_per_user?: number;
  position?: number;
  permission_overwrites?: IEndpointOverwriteObject;
  parent_id?: string;
  nsfw?: boolean;
}

export interface IEndpointOverwriteObject {
  id: string;
  type: string;
  allow: number;
  deny: number;
}

export interface IEndpointGuildMemberObject {
  access_token: string;
  nick?: string;
  roles?: string[];
  mute?: boolean;
  deaf?: boolean;
}

export interface IEndpointModifyGuildMemberObject {
  nick?: string;
  roles?: string[];
  mute?: boolean;
  deaf?: boolean;
  channel_id?: string;
}

export interface IEndpointGuildRole {
  name?: string;
  permissions?: number;
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
}

export interface IEndpointIntegrationObject {
  type: string;
  id: string;
}

export interface IEndpointModifyIntegrationObject {
  expire_behaviour: number;
  expire_grace_period: number;
  enable_emoticons: boolean;
}

export interface IEndpointGuildEmbedObject {
  enabled: boolean;
  channel_id: string;
}

export interface IEndpointAuditOptions {
  user_id?: string;
  action_type?: number;
  before?: string;
  limit?: number;
}
