import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import TextBasedChannel from './TextBasedChannel';

export default class TextChannel extends TextBasedChannel {
  public Guild: Guild;

  public GuildId: string;
  public Position: number;
  public PermissionOverwrites: any[];
  public Topic: string;
  public NSFW: boolean;

  public RateLimitPerUser: number | undefined;
  public ParentId: string | undefined;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild) {
    super(Client, ChannelObject);

    this.Guild = guild;

    this.GuildId = guild.id;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[]; // TODO
    this.Topic = ChannelObject.topic as string;
    this.NSFW = ChannelObject.nsfw as boolean;

    this.RateLimitPerUser = ChannelObject.rate_limit_per_user ? ChannelObject.rate_limit_per_user : undefined;
    this.ParentId = ChannelObject.parent_id ? ChannelObject.parent_id : undefined;
  }
}
