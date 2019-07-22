import DiscordClient from '../DiscordClient';
import Guild from '../resources/Guild/Guild';
import Store from './Store';
export default class GuildStore extends Store {
    /**
     *
     * @param client
     * @constructor
     */
    constructor(client: DiscordClient);
    AddGuild(GuildToBeStored: Guild): void;
    ReplaceGuild(GuildId: string, NewGuild: Guild): void;
    RemoveGuild(GuildId: string): void;
    /**
     * Fetch a Guild From id
     * @param GuildId - guild id
     */
    Fetch(GuildId: string): Promise<Guild>;
}
