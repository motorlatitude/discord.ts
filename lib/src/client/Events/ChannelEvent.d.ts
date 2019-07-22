import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class ChannelEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordChannel;
    private EventName;
    private EventObject;
    private EventDeleteObject;
    constructor(client: DiscordClient, data: IDiscordChannel);
    /**
     * Handle CHANNEL_CREATE event
     */
    HandleCreate(): void;
    /**
     * Handle CHANNEL_UPDATE event
     */
    HandleUpdate(): void;
    /**
     * Handle CHANNEL_DELETE
     */
    HandleDelete(): void;
    /**
     * Handle Emitting To Client
     * @override
     */
    EmitEvent(): void;
}
