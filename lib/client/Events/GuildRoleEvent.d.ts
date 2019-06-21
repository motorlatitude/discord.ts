import { IDiscordGuildRoleEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import Role from '../../resources/Guild/Role';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildRoleEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordGuildRoleEvent;
    EventName?: 'GUILD_ROLE_CREATE' | 'GUILD_ROLE_UPDATE' | 'GUILD_ROLE_DELETE';
    EventGuildObject?: Guild;
    EventRoleObject?: Role;
    constructor(client: DiscordClient, msg: IDiscordGuildRoleEvent);
    /**
     * Handles GUILD_ROLE_CREATE event
     */
    HandleRoleCreate(): void;
    /**
     * Handles GUILD_ROLE_UPDATE event
     */
    HandleRoleUpdate(): void;
    /**
     * Handles GUILD_ROLE_DELETE event
     */
    HandleRoleDelete(): void;
    EmitEvent(): void;
}
