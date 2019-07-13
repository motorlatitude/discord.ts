import { IDiscordEmbed, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointGuildEmbedObject } from '../../../common/types/GuildEndpoint.types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildEmbedActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Get this guilds embed
   */
  public GetEmbed(): Promise<IDiscordEmbed> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildEmbed(this.Guild.id)
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
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ModifyGuildEmbed(this.Guild.id, NewGuildEmbed)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
