import { IDiscordHTTPResponse } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildUserActions extends GuildAction {
  /**
   * Set the current users nickname in this guild
   * @param Nickname - the new nickname to use
   */
  public SetNick(Nickname: string): Promise<{ nick: string }> {
    return new Promise((resolve, reject) => {
      this.Endpoint.ModifyCurrentUserNick(this.Guild.id, Nickname)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
