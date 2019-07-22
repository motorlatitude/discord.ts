import { IDiscordRole } from '../../../common/types';
import { IEndpointGuildRole } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildRoleActions extends GuildAction {
    /**
     * Get roles in this guild
     */
    GetRoles(): Promise<IDiscordRole[]>;
    /**
     * Creates a new role in this guild
     * @param NewGuildRole - role object containing the new role's properties
     */
    CreateRole(NewGuildRole: IEndpointGuildRole): Promise<IDiscordRole>;
}
