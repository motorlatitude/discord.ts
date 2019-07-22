import { IChannelPinsUpdateEventObject, IDiscordChannelPinsUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class ChannelPinsUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordChannelPinsUpdateGatewayEvent;
    readonly EventName: string;
    EventObject: IChannelPinsUpdateEventObject | undefined;
    constructor(client: DiscordClient, message: IDiscordChannelPinsUpdateGatewayEvent);
    Handle(): void;
    EmitEvent(): void;
}
