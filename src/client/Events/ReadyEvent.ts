import { IReadyEventObject, IReadyGatewayEvent } from '../../common/types';

import EVENTS from '../../common/constants/events';
import GATEWAYEVENTS from '../../common/constants/gatewayevents';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class ReadyEvent extends ClientDispatcherEvent {
  private Client: DiscordClient;
  private readonly EventData: IReadyGatewayEvent;

  constructor(client: DiscordClient, data: IReadyGatewayEvent) {
    super(client);

    this.Client = client;
    this.EventData = data;
  }

  public Handle(): void {
    this.StoreGatewayProtocolVersion(this.EventData.v);
    this.StoreSessionId(this.EventData.session_id);
    this.StoreUserId(this.EventData.user.id);

    this.EventName = EVENTS.READY;

    this.EventObject = {
      user: this.EventData.user,
    };

    super.Handle();
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
