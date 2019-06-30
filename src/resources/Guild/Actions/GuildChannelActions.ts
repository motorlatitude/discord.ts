
import { IDiscordChannel, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointChannelObject } from '../../../common/types/GuildEndpoint.types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildChannelActions {

  private Client: DiscordClient;
  private Guild: Guild;


  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Request Guild Channels, this will call the API
   */
  public GetChannels(): Promise<IDiscordChannel[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildChannels(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Create a new channel in this guild, this will call the API
   * @param NewChannelObject - the new channel object
   */
  public CreateNewChannel(NewChannelObject: IEndpointChannelObject): Promise<IDiscordChannel> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .CreateGuildChannel(this.Guild.id, NewChannelObject)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }



}