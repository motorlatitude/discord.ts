import { IDiscordBan } from '../../../common/types';
import GuildAction from './GuildAction';
export default class GuildBanActions extends GuildAction {
    /**
     * Get all banned members for this guild
     */
    GetBans(): Promise<IDiscordBan[]>;
    /**
     * Get ban for a specific user
     * @param UserId - the user id of the member that is banned
     */
    GetBanForUser(UserId: string): Promise<IDiscordBan>;
    /**
     * Unban a user that has been banned
     * @param UserId - the user id of the user to be unbanned
     */
    UnbanUser(UserId: string): Promise<undefined>;
}
