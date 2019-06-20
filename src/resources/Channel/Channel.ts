import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';

export default class Channel {
  public id: string;
  public type: number;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel) {
    this.id = ChannelObject.id;
    this.type = ChannelObject.type;
  }
}
