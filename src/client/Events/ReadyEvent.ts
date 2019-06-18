import { IReadyEventObject, IReadyGatewayEvent } from '../../common/types';

import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class ReadyEvent extends ClientDispatcherEvent {
  public readonly Message: IReadyGatewayEvent;

  private EventObject: IReadyEventObject | undefined;

  constructor(client: DiscordClient, data: IReadyGatewayEvent) {
    super(client);

    this.Message = data;
  }

  public Handle(): void {
    this.StoreGatewayProtocolVersion(this.Message.v);
    this.StoreSessionId(this.Message.session_id);
    this.StoreUserId(this.Message.user.id);

    this.EventObject = {
      user: this.Message.user,
    };

    super.Handle();
  }

  public EmitEvent(): void {
    if(this.EventObject){
      this.Client.emit("READY", this.EventObject);
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

  private StoreUserId(UserId: string): void {
    if (this.Client.connection) {
      this.Client.connection.SetUserId(UserId);
    }
  }
}
