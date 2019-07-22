import { IDiscordWebhooksUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class WebhooksUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordWebhooksUpdateGatewayEvent;
    readonly EventName: 'WEBHOOKS_UPDATE';
    EventGuildObject?: Guild;
    EventChannelObject?: TextChannel;
    constructor(client: DiscordClient, msg: IDiscordWebhooksUpdateGatewayEvent);
    /**
     * Handles WEBHOOKS_UPDATE
     * Sent when a guild channel's webhook is created, updated, or deleted.
     */
    Handle(): void;
    EmitEvent(): void;
}
