import { IDiscordBan, IDiscordHTTPResponse } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildBanActions {

  private Client: DiscordClient;
  private Guild: Guild;


  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }


  /**
   * Get all banned members for this guild
   */
  public GetBans(): Promise<IDiscordBan[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildBans(this.Guild.id)
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
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildBan(this.Guild.id, UserId)
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
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .RemoveGuildBan(this.Guild.id, UserId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }


}