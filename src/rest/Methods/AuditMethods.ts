import { IEndpointAuditOptions } from '../../common/types/GuildEndpoint.types';
import DiscordRequester from '../DiscordRequester';
import HTTP_CONSTANTS from './../../common/constants/http';

export default class AuditMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  /**
   * GET /guilds/{guild.id}/audit-logs
   * @param GuildId - the id of the guild of which to fetch the audit log
   * @param Options - query options to attach to this request
   */
  public GetGuildAuditLog(GuildId: string, Options: IEndpointAuditOptions): Promise<any> {
    let QueryOptions = '?';
    Object.entries(Options).forEach(([key, value]) => (QueryOptions += key + '=' + value + '&'));
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.POST,
      '/guilds/' + GuildId + '/audit-logs' + QueryOptions.slice(0, -1),
    );
  }
}
