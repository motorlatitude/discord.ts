import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Channel from './Channel';
export default class CategoryChannel extends Channel {
    Name: string;
    Position: number;
    PermissionOverwrites: any[];
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
}
