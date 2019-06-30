import { IDiscordGuild, IDiscordHTTPResponse } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildActions {

  private Client: DiscordClient;
  private Guild: Guild;


  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }


  /**
   * Modify this guild, this will call the API
   * @param Parameters - parameters to alter https://discordapp.com/developers/docs/resources/guild#modify-guild-json-params
   */
  public Modify(Parameters: any): Promise<IDiscordGuild> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ModifyGuild(this.Guild.id, Parameters)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Deletes this guild, this will call the API
   */
  public Delete(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .DeleteGuild(this.Guild.id)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }



}