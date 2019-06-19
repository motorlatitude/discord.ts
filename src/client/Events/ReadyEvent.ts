import { IDiscordReadyGatewayEvent, IDiscordUser } from '../../common/types';

import DiscordClient from '../../DiscordClient';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class ReadyEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordReadyGatewayEvent;

  private EventObject?: User;

  constructor(client: DiscordClient, data: IDiscordReadyGatewayEvent) {
    super(client);

    this.Message = data;
  }

  public Handle(): void {
    this.StoreGatewayProtocolVersion(this.Message.v);
    this.StoreSessionId(this.Message.session_id);
    this.StoreUser(this.Message.user);

    this.EventObject = new User(this.Message.user);

    if (this.Client.connection) {
      this.Client.connection.SetStatus('', 2, 'online');
    }

    super.Handle();
  }

  public EmitEvent(): void {
    if (this.EventObject) {
      this.Client.emit('READY', this.EventObject);
    }
  }

  private StoreGatewayProtocolVersion(ProtocolVersion: number): void {
    if (this.Client.connection) {
      this.Client.connection.GatewayProtocolVersion = ProtocolVersion;
    }
  }

  private StoreSessionId(SessionId: string): void {
    if (this.Client.connection) {
      this.Client.connection.GatewaySessionId = SessionId;
    }
  }

  private StoreUser(UserObject: IDiscordUser): void {
    if (this.Client.connection) {
      this.Client.User = new User(UserObject);
    }
  }
}
