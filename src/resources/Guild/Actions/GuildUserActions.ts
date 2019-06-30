import { IDiscordHTTPResponse } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildUserActions {

  private Client: DiscordClient;
  private Guild: Guild;


  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Set the current users nickname in this guild
   * @param Nickname - the new nickname to use
   */
  public SetNick(Nickname: string): Promise<{ nick: string }> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ModifyCurrentUserNick(this.Guild.id, Nickname)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}