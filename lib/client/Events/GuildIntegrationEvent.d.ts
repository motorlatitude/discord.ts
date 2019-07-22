import { IDiscordGuildIntegrationUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildIntegrationEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordGuildIntegrationUpdateGatewayEvent;
    readonly EventName: 'GUILD_INTEGRATION_UPDATE';
    EventObject?: Guild;
    constructor(client: DiscordClient, msg: IDiscordGuildIntegrationUpdateGatewayEvent);
    Handle(): Promise<Guild>;
    EmitEvent(): void;
}
