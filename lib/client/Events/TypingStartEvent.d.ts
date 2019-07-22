import { IDiscordTypingStartGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class TypingStartEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordTypingStartGatewayEvent;
    readonly EventName: 'TYPING_START';
    EventChannelObject?: TextChannel | DirectMessageChannel;
    EventUserObject?: User;
    EventTimestampObject?: number;
    EventGuildObject?: Guild;
    constructor(client: DiscordClient, msg: IDiscordTypingStartGatewayEvent);
    /**
     * Handles TYPING_START event
     */
    Handle(): void;
    EmitEvent(): void;
}
