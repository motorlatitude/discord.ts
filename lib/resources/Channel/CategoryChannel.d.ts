import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import Channel from './Channel';
export default class CategoryChannel extends Channel {
    Guild: Guild;
    Name: string;
    Position: number;
    PermissionOverwrites: any[];
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild);
}
