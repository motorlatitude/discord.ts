import { IDiscordUser } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class UserUpdateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordUser;

  public readonly EventName: 'USER_UPDATE' = 'USER_UPDATE';
  public EventUserObject?: User;

  constructor(client: DiscordClient, msg: IDiscordUser) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles USER_UPDATE event
   * Sent when properties about the current bot user change
   */
  public Handle(): void {
    const NewUser = new User(this.Message);
    this.Client.User = NewUser;

    this.EventUserObject = NewUser;

    super.Handle();
  }

  public EmitEvent(): void {
    if (this.EventUserObject) {
      this.Client.emit(this.EventName, this.EventUserObject);
    }
  }
}
