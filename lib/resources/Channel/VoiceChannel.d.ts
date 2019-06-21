import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Channel from './Channel';
export default class VoiceChannel extends Channel {
    GuildId: string;
    Position: number;
    PermissionOverwrites: any[];
    Name: string;
    Bitrate: number;
    UserLimit: number;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
}
