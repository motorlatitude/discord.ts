import * as os from 'os';
import GATEWAY from '../common/constants/gateway';
import { IDiscordHelloPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';

export default class ClientConnectFlow {
  private readonly Client: DiscordClient;
  private Connection: ClientConnection;
  private readonly Token: string;

  private GatewayHeartbeatSendTimestamp: number = 0;
  private GatewayTotalPings: number = 0;

  constructor(client: DiscordClient, cc: ClientConnection, token: string) {
    this.Client = client;
    this.Connection = cc;
    this.Token = token;
  }

  /**
   * Start Connection Flow Once Hello Payload Received From Discord
   * @param HelloPackage - the hello package with opcode 10
   */
  public Start(HelloPackage: IDiscordHelloPackage): void {
    this.Client.logger.write().debug({
      message: 'Received Hello Payload',
      service: 'ClientConnection.ClientConnectFlow.Start',
    });
    this.Connection.resuming = false;

    this.Connection.GatewayHeartbeatInterval = HelloPackage.heartbeat_interval;
    // @ts-ignore
    this.Connection.GatewayHeartbeat = setInterval(() => {
      this.GatewayHeartbeatSendTimestamp = new Date().getTime();
      this.Connection.send(GATEWAY.HEARTBEAT, this.Connection.GatewaySequence);
    }, HelloPackage.heartbeat_interval);

    this.Client.logger.write().debug({
      message: 'Send Identify Payload',
      service: 'ClientConnection.ClientConnectFlow.Start',
    });
    this.SendIdentifyPayload();
  }

  /**
   * Sent Heartbeat has been acknowledged and returned
   */
  public HeartbeatAcknowledged(): void {
    const ping = new Date().getTime() - this.GatewayHeartbeatSendTimestamp;
    this.Connection.GatewayPings.push(ping);
    this.GatewayTotalPings += ping;
    this.Connection.GatewayPing = this.GatewayTotalPings / this.Connection.GatewayPings.length;
    this.Client.logger.write().debug({
      message:
        'Heartbeat acknowledged with sequence: ' +
        this.Connection.GatewaySequence +
        ' (' +
        ping +
        'ms - avergae: ' +
        Math.round(this.Connection.GatewayPing * 100) / 100 +
        'ms)',
      service: 'ClientConnection.ClientConnectFlow.HeartbeatAcknowledged',
    });
  }

  /**
   * Attempt to reconnect to discord gateway server by resuming the connection
   */
  public Reconnect(): void {
    this.Client.logger.write().debug({
      message: 'Trying To Reconnect, Sending Resume Payload',
      service: 'ClientConnection.ClientConnectFlow.Reconnect',
    });
    this.Connection.send(GATEWAY.RESUME, {
      seq: this.Connection.GatewaySequence,
      session_id: this.Connection.GatewaySessionId,
      token: this.Token,
    });
  }

  /**
   * Sends Identify package to Discord Gateway Websocket server
   */
  private SendIdentifyPayload(): void {
    const useCompression = ClientConnection.CanUseCompression();
    this.Client.logger.write().debug({
      message: 'Can Use Compression: ' + useCompression,
      service: 'ClientConnection.ClientConnectFlow.SendIdentifyPayload',
    });
    this.Connection.send(GATEWAY.IDENTIFY, {
      compress: useCompression,
      large_threshold: 250,
      presence: {
        afk: false,
        game: {
          name: 'Identifying',
          type: 0,
        },
        since: new Date().getTime(),
        status: 'dnd',
      },
      properties: {
        $browser: 'Discord.ts',
        $device: 'Server',
        $os: os.platform(),
      },
      token: this.Token,
    });
  }
}
