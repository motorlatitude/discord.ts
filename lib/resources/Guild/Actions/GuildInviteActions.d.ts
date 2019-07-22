import { IDiscordInvite } from '../../../common/types';
import GuildAction from './GuildAction';
export default class GuildInviteActions extends GuildAction {
    /**
     * List available invites for this guild
     */
    GetInvites(): Promise<IDiscordInvite[]>;
}
