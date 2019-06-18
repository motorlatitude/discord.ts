import { IDiscordChannel } from '../../common/types';
import Channel from './Channel';

export default class VoiceChannel extends Channel {
  public GuildId: string;
  public Position: number;
  public PermissionOverwrites: any[];
  public Name: string;
  public Bitrate: number;
  public UserLimit: number;

  constructor(ChannelObject: IDiscordChannel) {
    super(ChannelObject);

    this.GuildId = ChannelObject.guild_id as string;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[];
    this.Name = ChannelObject.name as string;
    this.Bitrate = ChannelObject.bitrate as number;
    this.UserLimit = ChannelObject.user_limit as number;
  }
}
