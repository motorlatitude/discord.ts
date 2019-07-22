import { IDiscordEmbed } from '../types';
import { IEndpointOverwriteObject } from './GuildEndpoint.types';
export interface IEndpointModifyChannelObject {
    name?: string;
    position?: number;
    topic?: string;
    nsfw?: boolean;
    rate_limit_per_user?: number;
    bitrate?: number;
    user_limit?: number;
    permission_overwrites?: IEndpointOverwriteObject[];
    parent_id?: string;
}
export interface IEndpointChannelMessagesQuery {
    around?: string;
    before?: string;
    after?: string;
}
export interface IEndpointMessageDetailsObject {
    nonce?: string;
    tts?: boolean;
    embed: IDiscordEmbed;
}
export interface IEndpointReactionQuery {
    before?: string;
    after?: string;
    limit?: number;
}
export interface IEndpointEditMessage {
    content?: string;
    embed?: IDiscordEmbed;
}
export interface IEndpointChannelOverwriteObject {
    type: string;
    allow: number;
    deny: number;
}
export interface IEndpointChannelInvite {
    max_age?: number;
    max_uses?: number;
    temporary?: boolean;
    unique?: boolean;
}
