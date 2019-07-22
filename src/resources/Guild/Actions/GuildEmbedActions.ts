import { IDiscordEmbed, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointGuildEmbedObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';

export default class GuildEmbedActions extends GuildAction {
  /**
   * Get this guilds embed
   */
  public GetEmbed(): Promise<IDiscordEmbed> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildEmbed(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Modify the guild embed
   * @param NewGuildEmbed - the altered properties of the embed
   */
  public ModifyEmbed(NewGuildEmbed: IEndpointGuildEmbedObject): Promise<IDiscordEmbed> {
    return new Promise((resolve, reject) => {
      this.Endpoint.ModifyGuildEmbed(this.Guild.id, NewGuildEmbed)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
