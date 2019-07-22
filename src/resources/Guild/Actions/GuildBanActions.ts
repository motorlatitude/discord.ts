import { IDiscordBan, IDiscordHTTPResponse } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildBanActions extends GuildAction {
  /**
   * Get all banned members for this guild
   */
  public GetBans(): Promise<IDiscordBan[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildBans(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Get ban for a specific user
   * @param UserId - the user id of the member that is banned
   */
  public GetBanForUser(UserId: string): Promise<IDiscordBan> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildBan(this.Guild.id, UserId)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Unban a user that has been banned
   * @param UserId - the user id of the user to be unbanned
   */
  public UnbanUser(UserId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.RemoveGuildBan(this.Guild.id, UserId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
