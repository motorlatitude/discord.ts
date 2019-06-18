import { IDiscordChannel } from '../../common/types';
import Channel from './Channel';

export default class DirectMessageChannel extends Channel {
  public Name: string;
  public Recipients: any[];
  public Icon: string;
  public OwnerId: string;

  public LastMessageId: string | undefined;
  public ApplicationId: string | undefined;
  public LastPinTimestamp: number | undefined;

  constructor(ChannelObject: IDiscordChannel) {
    super(ChannelObject);

    this.Name = ChannelObject.name as string;
    this.LastMessageId = ChannelObject.last_message_id;
    this.Recipients = ChannelObject.recipients as any[];
    this.Icon = ChannelObject.icon ? ChannelObject.icon : '';
    this.OwnerId = ChannelObject.owner_id as string;

    this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
    this.ApplicationId = ChannelObject.application_id ? ChannelObject.application_id : undefined;
    this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
  }
}
