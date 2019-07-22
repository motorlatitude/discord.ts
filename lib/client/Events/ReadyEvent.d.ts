import { IDiscordReadyGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class ReadyEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordReadyGatewayEvent;
    private EventObject?;
    constructor(client: DiscordClient, data: IDiscordReadyGatewayEvent);
    Handle(): void;
    EmitEvent(): void;
    private StoreGatewayProtocolVersion;
    private StoreSessionId;
    private StoreUser;
}
