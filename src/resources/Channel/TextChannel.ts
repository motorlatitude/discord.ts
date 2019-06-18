import { IDiscordChannel } from '../../common/types';
import Channel from './Channel';

export default class TextChannel extends Channel {
  public GuildId: string;
  public Position: number;
  public PermissionOverwrites: any[];
  public Name: string;
  public Topic: string;
  public NSFW: boolean;

  public LastMessageId: string | undefined;
  public RateLimitPerUser: number | undefined;
  public ParentId: string | undefined;
  public LastPinTimestamp: number | undefined;

  constructor(ChannelObject: IDiscordChannel) {
    super(ChannelObject);

    this.GuildId = ChannelObject.guild_id as string;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[]; // TODO
    this.Name = ChannelObject.name as string;
    this.Topic = ChannelObject.topic as string;
    this.NSFW = ChannelObject.nsfw as boolean;

    this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
    this.RateLimitPerUser = ChannelObject.rate_limit_per_user ? ChannelObject.rate_limit_per_user : undefined;
    this.ParentId = ChannelObject.parent_id ? ChannelObject.parent_id : undefined;
    this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
  }
}
