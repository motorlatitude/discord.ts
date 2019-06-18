import DiscordClient from '../../DiscordClient';

export default class ClientDispatcherEvent {
  public client: DiscordClient;

  public EventObject: any = {};
  public EventName: string | undefined;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  public Handle(): void {
    this.PassEventOn();
  }

  private PassEventOn(): void {
    if (this.EventName) {
      this.client.emit(this.EventName, this.EventObject);
    } else {
      this.client.logger.write().error({
        message: new Error('Could Not Pass Event To DiscordClient as no EventName specified'),
        service: 'ClientDispatcher.Events.ClientDispatcherEvent.PassEventOn',
      });
    }
  }
}
