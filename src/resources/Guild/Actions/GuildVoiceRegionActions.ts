import { IDiscordHTTPResponse, IDiscordVoiceRegion } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildVoiceRegionActions extends GuildAction {
  /**
   * List available voice regions for this server
   */
  public GetVoiceRegions(): Promise<IDiscordVoiceRegion[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildVoiceRegions(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
