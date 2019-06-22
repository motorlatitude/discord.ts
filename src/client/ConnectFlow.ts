import * as os from 'os';
import GATEWAY from '../common/constants/gateway';
import Logger from '../common/Logger';
import { IDiscordHelloPackage } from '../common/types';
import ClientConnection from './ClientConnection';

export default class ConnectFlow {
  private logger: Logger;
  private connection: ClientConnection;
  private readonly token: string;

  private GatewayHeartbeatSendTimestamp: number = 0;
  private GatewayTotalPings: number = 0;

  constructor(cc: ClientConnection, log: Logger, token: string) {
    this.logger = log;
    this.connection = cc;
    this.token = token;
  }

  /**
   * Start Connection Flow Once Hello Payload Received From Discord
   * @param HelloPackage - the hello package with opcode 10
   */
  public Start(HelloPackage: IDiscordHelloPackage): void {
    this.logger.write().debug({
      message: 'Received Hello Payload',
      service: 'ClientConnection.ConnectFlow.Start',
    });
    this.connection.resuming = false;

    this.connection.GatewayHeartbeatInterval = HelloPackage.heartbeat_interval;
    // @ts-ignore
    this.connection.GatewayHeartbeat = setInterval(() => {
      this.GatewayHeartbeatSendTimestamp = new Date().getTime();
      this.connection.send(GATEWAY.HEARTBEAT, this.connection.GatewaySequence);
    }, HelloPackage.heartbeat_interval);

    this.logger.write().debug({
      message: 'Send Identify Payload',
      service: 'ClientConnection.ConnectFlow.Start',
    });
    this.SendIdentifyPayload();
  }

  /**
   * Sent Heartbeat has been acknowledged and returned
   */
  public HeartbeatAcknowledged(): void {
    const ping = new Date().getTime() - this.GatewayHeartbeatSendTimestamp;
    this.connection.GatewayPings.push(ping);
    this.GatewayTotalPings += ping;
    this.connection.GatewayPing = this.GatewayTotalPings / this.connection.GatewayPings.length;
    this.logger.write().debug({
      message:
        'Heartbeat acknowledged with sequence: ' +
        this.connection.GatewaySequence +
        '(' +
        ping +
        'ms - avergae: ' +
        Math.round(this.connection.GatewayPing * 100) / 100 +
        'ms)',
      service: 'ClientConnection.ConnectFlow.HeartbeatAcknowledged',
    });
  }

  /**
   * Attempt to reconnect to discord gateway server by resuming the connection
   */
  public Reconnect(): void {
    this.logger.write().debug({
      message: 'Trying To Reconnect, Sending Resume Payload',
      service: 'ClientConnection.ConnectFlow.Reconnect',
    });
    this.connection.send(GATEWAY.RESUME, {
      seq: this.connection.GatewaySequence,
      session_id: this.connection.GatewaySessionId,
      token: this.token,
    });
  }

  /**
   * Sends Identify package to Discord Gateway Websocket server
   */
  private SendIdentifyPayload(): void {
    const useCompression = ClientConnection.CanUseCompression();
    this.logger.write().debug({
      message: 'Can Use Compression: ' + useCompression,
      service: 'ClientConnection.ConnectFlow.SendIdentifyPayload',
    });
    this.connection.send(GATEWAY.IDENTIFY, {
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
      token: this.token,
    });
  }
}
