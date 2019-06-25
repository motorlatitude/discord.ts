import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import Guild from '../Guild/Guild';
import Channel from './Channel';

export default class TextChannel extends Channel {
  public Guild: Guild;

  public GuildId: string;
  public Position: number;
  public PermissionOverwrites: any[];
  public Name: string;
  public Topic: string;
  public NSFW: boolean;

  public Messages: MessageStore;

  public LastMessageId: string | undefined;
  public RateLimitPerUser: number | undefined;
  public ParentId: string | undefined;
  public LastPinTimestamp: number | undefined;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild: Guild) {
    super(Client, ChannelObject);

    this.Guild = guild;

    this.GuildId = guild.id;
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[]; // TODO
    this.Name = ChannelObject.name as string;
    this.Topic = ChannelObject.topic as string;
    this.NSFW = ChannelObject.nsfw as boolean;

    this.Messages = new MessageStore(Client);

    this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
    this.RateLimitPerUser = ChannelObject.rate_limit_per_user ? ChannelObject.rate_limit_per_user : undefined;
    this.ParentId = ChannelObject.parent_id ? ChannelObject.parent_id : undefined;
    this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
  }

  public SendMessage(Content: string): void {
    this.Client.rest
      .Methods()
      .ChannelMethods()
      .CreateMessage(Content, this.id);
  }
}
