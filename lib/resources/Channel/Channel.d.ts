import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
export default class Channel {
    id: string;
    type: number;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
}
