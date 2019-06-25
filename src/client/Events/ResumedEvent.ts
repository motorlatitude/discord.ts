import { IDiscordResumedPackage } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class ResumedEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordResumedPackage;

  public EventName: 'RESUMED' = 'RESUMED';

  constructor(client: DiscordClient, msg: IDiscordResumedPackage) {
    super(client);

    this.Message = msg;
  }

  public Handle(): void {
    super.Handle();
  }

  public EmitEvent(): void {
    this.Client.emit(this.EventName);
  }
}
