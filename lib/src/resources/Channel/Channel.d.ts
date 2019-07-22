import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
export default class Channel {
    id: string;
    type: number;
    protected readonly Client: DiscordClient;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
}
