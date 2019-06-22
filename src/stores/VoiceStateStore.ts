import DiscordClient from '../DiscordClient';
import VoiceState from '../resources/Voice/VoiceState';
import Store from './Store';

export default class VoiceStateStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  public AddVoiceState(VoiceStateObject: VoiceState): void {
    this.Add(VoiceStateObject.UserId, VoiceStateObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.VoiceStateStore.AddVoiceState.Store',
      });
    });
  }

  public UpdateVoiceState(UserId: string, VoiceStateObject: VoiceState): void {
    if (this.Get(UserId)) {
      this.Replace(UserId, VoiceStateObject).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.VoiceStateStore.UpdateVoiceState.Store.Replace',
        });
      });
    } else {
      this.AddVoiceState(VoiceStateObject);
    }
  }

  public RemoveVoiceState(UserId: string): void {
    if (this.Get(UserId)) {
      this.Delete(UserId).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.VoiceStateStore.RemoveVoiceState.Store',
        });
      });
    } else {
      // Nothing to delete
    }
  }
}
