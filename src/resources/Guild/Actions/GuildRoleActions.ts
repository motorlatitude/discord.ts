import { IDiscordHTTPResponse, IDiscordRole } from '../../../common/types';
import { IEndpointGuildRole } from '../../../common/types/GuildEndpoint.types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildRoleActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Get roles in this guild
   */
  public GetRoles(): Promise<IDiscordRole[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildRoles(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Creates a new role in this guild
   * @param NewGuildRole - role object containing the new role's properties
   */
  public CreateRole(NewGuildRole: IEndpointGuildRole): Promise<IDiscordRole> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .CreateGuildRole(this.Guild.id, NewGuildRole)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
