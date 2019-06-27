import DiscordClient from '../../DiscordClient';

/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
  private Client: DiscordClient;

  constructor(client: DiscordClient) {
    this.Client = client;
  }

  public Connect(LocalGatewayURL?: string): void {
    this.Client.emit('READY');
  }

  public Disconnect(): void {
    this.Client.emit('DISCONNECT');
  }
}
