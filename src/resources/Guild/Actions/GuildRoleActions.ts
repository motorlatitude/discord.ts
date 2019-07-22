import { IDiscordHTTPResponse, IDiscordRole } from '../../../common/types';
import { IEndpointGuildRole } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';

export default class GuildRoleActions extends GuildAction {
  /**
   * Get roles in this guild
   */
  public GetRoles(): Promise<IDiscordRole[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildRoles(this.Guild.id)
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
      this.Endpoint.CreateGuildRole(this.Guild.id, NewGuildRole)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
