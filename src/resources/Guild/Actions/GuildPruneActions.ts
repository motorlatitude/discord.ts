import { IDiscordHTTPResponse, IDiscordPruneCount } from '../../../common/types';
import GuildAction from './GuildAction';

export default class GuildPruneActions extends GuildAction {
  /**
   * Gets number of people that would be pruned
   * @param Days - number of days to count prune for
   */
  public GetPruneCount(Days: number = 1): Promise<IDiscordPruneCount> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildPruneCount(this.Guild.id, Days)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Start guild prune
   * @param Days - number of days to count prune for
   * @param ComputePruneCount - compute the number of people pruned, recommended false for large guilds
   */
  public Prune(Days: number, ComputePruneCount: boolean = false): Promise<IDiscordPruneCount> {
    return new Promise((resolve, reject) => {
      this.Endpoint.BeginGuildPrune(this.Guild.id, Days, ComputePruneCount)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
