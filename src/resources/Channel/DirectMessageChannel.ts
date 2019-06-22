import { IDiscordChannel, IDiscordUser } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import UserStore from '../../stores/UserStore';
import User from '../User/User';
import Channel from './Channel';

export default class DirectMessageChannel extends Channel {
  public Name: string;
  public Recipients: UserStore;
  public Icon: string;
  public OwnerId: string;

  public Messages: MessageStore;

  public LastMessageId: string | undefined;
  public ApplicationId: string | undefined;
  public LastPinTimestamp: number | undefined;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel) {
    super(Client, ChannelObject);

    this.Name = ChannelObject.name as string;
    this.LastMessageId = ChannelObject.last_message_id;
    this.Recipients = new UserStore(Client);
    if (ChannelObject.recipients) {
      this.ResolveRecipients(ChannelObject.recipients);
    }
    this.Icon = ChannelObject.icon ? ChannelObject.icon : '';
    this.OwnerId = ChannelObject.owner_id as string;

    this.Messages = new MessageStore(Client);

    this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
    this.ApplicationId = ChannelObject.application_id ? ChannelObject.application_id : undefined;
    this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
  }

  private ResolveRecipients(Recipients: IDiscordUser[]): void {
    for (const user of Recipients) {
      this.Recipients.AddUser(new User(user));
    }
  }
}
