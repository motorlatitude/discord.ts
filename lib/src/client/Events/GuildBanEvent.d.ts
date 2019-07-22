import { IDiscordGuildBanGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildBanEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordGuildBanGatewayEvent;
    EventName?: 'GUILD_BAN_REMOVE' | 'GUILD_BAN_ADD';
    EventGuildObject?: Guild;
    EventUserObject?: User;
    constructor(client: DiscordClient, msg: IDiscordGuildBanGatewayEvent);
    /**
     * Sent when a user is banned from a guild
     */
    HandleBanAdd(): void;
    /**
     * Sent when a banned user is unbanned from the guild
     */
    HandleBanRemove(): void;
    EmitEvent(): void;
}
