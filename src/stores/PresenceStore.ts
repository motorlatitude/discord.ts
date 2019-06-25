import DiscordClient from '../DiscordClient';
import Presence from '../resources/User/Presence';
import Store from './Store';

export default class PresenceStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  public AddPresence(PresenceObject: Presence): void {
    if (PresenceObject.User) {
      this.Add(PresenceObject.User.id, PresenceObject).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.PresenceStore.AddPresence.Store',
        });
      });
    } else {
      // We need a valid user id
      this.Client.logger.write().error({
        message: new Error("Couldn't add presence as no User is present"),
        service: 'DiscordClient.PresenceStore.AddPresence',
      });
    }
  }

  public UpdatePresence(UserId: string, PresenceObject: Presence): void {
    if (this.Get(UserId)) {
      this.Replace(UserId, PresenceObject).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.PresenceStore.UpdatePresence.Store',
        });
      });
    } else {
      this.AddPresence(PresenceObject);
    }
  }

  public Get(UserId: string): Presence {
    return super.Get(UserId);
  }
}
