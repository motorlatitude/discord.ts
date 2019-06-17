//Node Modules
import * as os from 'os';

import Logger from '../common/Logger';
import ClientConnection from './ClientConnection';

//Types
import { DiscordHelloPackage } from '../common/types';

//Constants
import GATEWAY from '../common/constants/gateway';

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
   * @param hello_package - the hello package with opcode 10
   */
  public Start(hello_package: DiscordHelloPackage): void {
    this.logger.write('[ConnectFlow]: Received Hello Payload');

    let _this = this;
    this.connection.GatewayHeartbeatInterval = hello_package.heartbeat_interval;
    this.connection.GatewayHeartbeat = window.setInterval(() => {
      _this.GatewayHeartbeatSendTimestamp = new Date().getTime();
      _this.connection.send(GATEWAY.HEARTBEAT, _this.connection.GatewaySequence);
    }, hello_package.heartbeat_interval);

    this.logger.write('[ConnectFlow]: Send Identify Payload');
    this.SendIdentifyPayload();
  }

  /**
   * Sent Heartbeat has been acknowledged and returned
   */
  public HeartbeatAcknowledged(): void {
    let ping = new Date().getTime() - this.GatewayHeartbeatSendTimestamp;
    this.connection.GatewayPings.push(ping);
    this.GatewayTotalPings += ping;
    this.connection.GatewayPing = this.GatewayTotalPings / this.connection.GatewayPings.length;
    this.logger.write(
      '[ConnectFlow]: Heartbeat acknowledged with sequence: ' +
        this.connection.GatewaySequence +
        ' (' +
        ping +
        'ms - average: ' +
        Math.round(this.connection.GatewayPing * 100) / 100 +
        'ms)',
    );
  }

  /**
   * Attempt to reconnect to discord gateway server by resuming the connection
   */
  public Reconnect(): void {
    this.logger.write('[ConnectFlow]: Trying To Reconnect, Sending Resume Payload');
    this.connection.send(GATEWAY.RESUME, {
      token: this.token,
      session_id: this.connection.GatewaySessionId,
      seq: this.connection.GatewaySequence,
    });
  }

  /**
   * Sends Identify package to Discord Gateway Websocket server
   */
  private SendIdentifyPayload(): void {
    const useCompression = this.connection.CanUseCompression();
    this.logger.write('[ConnectFlow]: Can Use Compression: ' + useCompression);
    this.connection.send(GATEWAY.IDENTIFY, {
      token: this.token,
      properties: {
        $os: os.platform(),
        $browser: 'Discord.ts',
        $device: 'Server',
      },
      compress: useCompression,
      large_threshold: 250,
      presence: {
        game: {
          name: 'Identifying',
          type: 0,
        },
        status: 'dnd',
        since: new Date().getTime(),
        afk: false,
      },
    });
  }
}
