import { IDiscordHTTPResponse, IDiscordVanityURL } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildVanityURLActions extends GuildAction {
  /**
   * Get the vanity url for this guild
   */
  public VanityURL(): Promise<IDiscordVanityURL> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildVanityURL(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
