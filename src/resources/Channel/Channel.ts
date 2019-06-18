import { IDiscordChannel } from '../../common/types';

export default class Channel {
  public id: string;
  public type: number;

  constructor(ChannelObject: IDiscordChannel) {
    this.id = ChannelObject.id;
    this.type = ChannelObject.type;
  }
}
