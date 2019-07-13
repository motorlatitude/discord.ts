import { IDiscordAuditLog, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointAuditOptions } from '../../../common/types/GuildEndpoint.types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildAuditActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Fetch the audit log for this guild
   * @param Options - options to retrieve the audit log
   */
  public GetAuditLog(Options: IEndpointAuditOptions): Promise<IDiscordAuditLog> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .AuditMethods()
        .GetGuildAuditLog(this.Guild.id, Options)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
