import { IDiscordPruneCount } from '../../../common/types';
import GuildAction from './GuildAction';
export default class GuildPruneActions extends GuildAction {
    /**
     * Gets number of people that would be pruned
     * @param Days - number of days to count prune for
     */
    GetPruneCount(Days?: number): Promise<IDiscordPruneCount>;
    /**
     * Start guild prune
     * @param Days - number of days to count prune for
     * @param ComputePruneCount - compute the number of people pruned, recommended false for large guilds
     */
    Prune(Days: number, ComputePruneCount?: boolean): Promise<IDiscordPruneCount>;
}
