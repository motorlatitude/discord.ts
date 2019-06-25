import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import Guild from '../Guild/Guild';
import Channel from './Channel';
export default class TextChannel extends Channel {
    Guild: Guild;
    GuildId: string;
    Position: number;
    PermissionOverwrites: any[];
    Name: string;
    Topic: string;
    NSFW: boolean;
    Messages: MessageStore;
    LastMessageId: string | undefined;
    RateLimitPerUser: number | undefined;
    ParentId: string | undefined;
    LastPinTimestamp: number | undefined;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild);
    SendMessage(Content: string): void;
}
