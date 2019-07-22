import DiscordClient from '../../DiscordClient';

export default class ClientDispatcherEvent {
  public Client: DiscordClient;

  constructor(client: DiscordClient) {
    this.Client = client;
  }

  public Handle(EventType?: string): void {
    this.EmitEvent();
  }

  /**
   * Emit Event to DiscordClient Class, this method should always be overwritten
   */
  public EmitEvent(): void {
    this.Client.logger.write().warn({
      message: new Error('No Event Defined'),
      service: 'ClientDispatcher.Events.ClientDispatcherEvent.EmitEvent',
    });
  }
}
