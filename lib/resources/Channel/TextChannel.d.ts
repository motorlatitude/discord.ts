import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import TextBasedChannel from './TextBasedChannel';
export default class TextChannel extends TextBasedChannel {
    Guild: Guild;
    GuildId: string;
    Position: number;
    PermissionOverwrites: any[];
    Topic: string;
    NSFW: boolean;
    RateLimitPerUser: number | undefined;
    ParentId: string | undefined;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild);
}
