import { IEndpointAuditOptions } from '../../common/types/GuildEndpoint.types';
import DiscordRequester from '../DiscordRequester';
export default class AuditMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    /**
     * GET /guilds/{guild.id}/audit-logs
     * @param GuildId - the id of the guild of which to fetch the audit log
     * @param Options - query options to attach to this request
     */
    GetGuildAuditLog(GuildId: string, Options: IEndpointAuditOptions): Promise<any>;
}
