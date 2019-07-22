import DiscordClient from '../../../DiscordClient';
import GuildMethods from '../../../rest/Methods/GuildMethods';
import Action from '../../Actions/Action';
import Guild from '../Guild';
export default class GuildAction extends Action {
    protected readonly Guild: Guild;
    protected readonly Endpoint: GuildMethods;
    constructor(client: DiscordClient, guild: Guild);
}
