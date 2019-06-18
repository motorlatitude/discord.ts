import { IDiscordChannel } from '../../common/types';
import Channel from './Channel';

export default class CategoryChannel extends Channel {
  public Name: string;
  public Position: number;
  public PermissionOverwrites: any[];

  constructor(ChannelObject: IDiscordChannel) {
    super(ChannelObject);

    this.Name = ChannelObject.name as string;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[];
  }
}
