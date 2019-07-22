import { IDiscordChannel, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointChannelObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';

export default class GuildChannelActions extends GuildAction {
  /**
   * Request Guild Channels, this will call the API
   */
  public GetChannels(): Promise<IDiscordChannel[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildChannels(this.Guild.id)
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
      this.Endpoint.CreateGuildChannel(this.Guild.id, NewChannelObject)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
