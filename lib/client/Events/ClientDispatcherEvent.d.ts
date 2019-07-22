import DiscordClient from '../../DiscordClient';
export default class ClientDispatcherEvent {
    Client: DiscordClient;
    constructor(client: DiscordClient);
    Handle(EventType?: string): void;
    /**
     * Emit Event to DiscordClient Class, this method should always be overwritten
     */
    EmitEvent(): void;
}
