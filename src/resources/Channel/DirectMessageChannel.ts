import { IDiscordChannel, IDiscordUser } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import UserStore from '../../stores/UserStore';
import User from '../User/User';
import TextBasedChannel from './TextBasedChannel';

export default class DirectMessageChannel extends TextBasedChannel {

  public Recipients: UserStore;
  public Icon: string;
  public OwnerId: string;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel) {
    super(Client, ChannelObject);

    this.Recipients = new UserStore(Client);
    if (ChannelObject.recipients) {
      this.ResolveRecipients(ChannelObject.recipients);
    }
    this.Icon = ChannelObject.icon ? ChannelObject.icon : '';
    this.OwnerId = ChannelObject.owner_id as string;

  }

  private ResolveRecipients(Recipients: IDiscordUser[]): void {
    for (const user of Recipients) {
      this.Recipients.AddUser(new User(user));
    }
  }
}
