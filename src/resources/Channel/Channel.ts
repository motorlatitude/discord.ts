import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';

export default class Channel {
  public id: string;
  public type: number;

  protected readonly Client: DiscordClient;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel) {

    this.Client = Client;

    this.id = ChannelObject.id;
    this.type = ChannelObject.type;
  }
}
