import DiscordClient from '../DiscordClient';
import User from '../resources/User/User';
import Store from './Store';

export default class UserStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  public AddUser(UserObject: User): void {
    this.Add(UserObject.id, UserObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.UserStore.AddUser.Store',
      });
    });
  }

  public RemoveUser(UserId: string): void {
    this.Delete(UserId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.UserStore.RemoveUser.Store',
      });
    });
  }

  public Fetch(UserId: string): Promise<User> {
    return new Promise(resolve => {
      resolve(this.Get(UserId));
    });
  }
}
