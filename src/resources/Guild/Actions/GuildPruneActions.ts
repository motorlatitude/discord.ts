import { IDiscordHTTPResponse, IDiscordPruneCount } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildPruneActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Gets number of people that would be pruned
   * @param Days - number of days to count prune for
   */
  public GetPruneCount(Days: number = 1): Promise<IDiscordPruneCount> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildPruneCount(this.Guild.id, Days)
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
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .BeginGuildPrune(this.Guild.id, Days, ComputePruneCount)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
