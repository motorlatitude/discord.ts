import { IDiscordHTTPResponse, IDiscordVoiceRegion } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildVoiceRegionActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * List available voice regions for this server
   */
  public GetVoiceRegions(): Promise<IDiscordVoiceRegion[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildVoiceRegions(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
