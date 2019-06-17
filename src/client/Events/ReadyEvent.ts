import ClientConnection from '../ClientConnection';
import { ReadyEventObject, ReadyGatewayEvent, UnavailabeGuildObject } from '../../common/types';

import EVENTS from '../../common/constants/events';

export default class ReadyEvent {
  connection: ClientConnection;
  private readonly data: ReadyGatewayEvent;

  constructor(connection: ClientConnection, data: ReadyGatewayEvent) {
    this.connection = connection;

    this.data = data;

    this.StoreGatewayProtocolVersion(data.v);
    this.StoreSessionId(data.session_id);
    this.StoreUserId(data.user.id);

    this.PassEventOn();
  }

  private StoreGatewayProtocolVersion(protocol_version: number): void {
    this.connection.GatewayProtocolVersion = protocol_version;
  }

  private StoreSessionId(session_id: string): void {
    this.connection.GatewaySessionId = session_id;
  }

  private StoreUserId(user_id: string): void {
    this.connection.SetUserId(user_id);
  }

  private PassEventOn(): void {
    let ready_event: ReadyEventObject = {
      user: this.data.user,
    };

    this.connection.EmitEventListenerEvent(EVENTS.READY, ready_event);
  }
}
