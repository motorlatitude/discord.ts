import { IDiscordHTTPResponse, IDiscordInvite } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildInviteActions extends GuildAction {
  /**
   * List available invites for this guild
   */
  public GetInvites(): Promise<IDiscordInvite[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildInvites(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
