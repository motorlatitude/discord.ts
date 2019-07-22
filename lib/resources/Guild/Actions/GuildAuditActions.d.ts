import { IDiscordAuditLog } from '../../../common/types';
import { IEndpointAuditOptions } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildAuditActions extends GuildAction {
    /**
     * Fetch the audit log for this guild
     * @param Options - options to retrieve the audit log
     */
    GetAuditLog(Options: IEndpointAuditOptions): Promise<IDiscordAuditLog>;
}
