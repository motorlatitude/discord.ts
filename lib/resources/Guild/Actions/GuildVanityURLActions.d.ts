import { IDiscordVanityURL } from '../../../common/types';
import GuildAction from './GuildAction';
export default class GuildVanityURLActions extends GuildAction {
    /**
     * Get the vanity url for this guild
     */
    VanityURL(): Promise<IDiscordVanityURL>;
}
