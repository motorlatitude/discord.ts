import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import Channel from './Channel';

export default class CategoryChannel extends Channel {
  public Guild: Guild;

  public Name: string;
  public Position: number;
  public PermissionOverwrites: any[];

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild) {
    super(Client, ChannelObject);

    this.Guild = guild;

    this.Name = ChannelObject.name as string;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[];
  }
}
