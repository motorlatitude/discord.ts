import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class ChannelEvents extends ClientDispatcherEvent {
    DiscordChannel: IDiscordChannel;
    constructor(client: DiscordClient, data: IDiscordChannel);
    /**
     * Handle CHANNEL_CREATE event
     * @constructor
     */
    HandleCreate(): void;
}
