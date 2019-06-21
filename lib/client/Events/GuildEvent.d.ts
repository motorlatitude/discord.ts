import { IDiscordGuild, IDiscordUnavailableGuildObject, IGuildDeleteEventObject } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildEvent extends ClientDispatcherEvent {
    EventName: string | undefined;
    EventObject: Guild | undefined;
    EventDeleteObject: IGuildDeleteEventObject | undefined;
    constructor(client: DiscordClient);
    /**
     * Handles GUILD_CREATE event
     * GUILD_CREATE event is sent when
     * 1. When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the Ready event.
     * 2. When a Guild becomes available again to the client.
     * 3. When the current user joins a new Guild.
     * https://discordapp.com/developers/docs/topics/gateway#guild-create
     * @param Message GUILD_CREATE event package
     */
    HandleCreate(Message: IDiscordGuild): void;
    /**
     * Handles GUILD_UPDATE event
     * @param Message GUILD_UPDATE event package
     */
    HandleUpdate(Message: IDiscordGuild): void;
    /**
     * Handles GUILD_DELETE event
     * @param Message GUILD_DELETE event package
     */
    HandleDelete(Message: IDiscordUnavailableGuildObject): void;
    EmitEvent(): void;
}
