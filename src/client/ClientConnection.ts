// Node Modules
import * as zlib from 'zlib';

// NPM Modules
import * as ws from 'ws';

// Others
import Logger from '../common/Logger';
import DiscordClient from '../DiscordClient';
import ClientDispatcher from './ClientDispatcher';
import ConnectFlow from './ConnectFlow';

// Types
import { IDefaultDiscordGatewayPackage, IDiscordHelloPackage } from '../common/types';

// Constants
import GATEWAY from '../common/constants/gateway';

/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
  public GatewayHeartbeat: number | undefined;
  public GatewayWebsocket: ws | undefined;
  public GatewaySequence: number = 0;
  public GatewayPings: number[] = [];
  public GatewayPing: number = 0;
  public GatewaySessionId: string = '';
  public GatewayHeartbeatInterval: number = 0;
  public GatewayProtocolVersion: number = 6;

  private App: DiscordClient;
  private logger: Logger;

  private dispatcher: ClientDispatcher;
  private connector: ConnectFlow;

  private resuming: boolean = false;

  /**
   * Create a new connection with discords gateway server
   * @param app - pass parent class as parameter to modify accessible vars and pass events through
   */
  constructor(app: DiscordClient, log: Logger) {
    this.App = app;
    this.logger = log;

    this.dispatcher = new ClientDispatcher(app, this, log);
    this.connector = new ConnectFlow(this, log, app.token);
  }

  /**
   * Connect to discord gateway
   * @param GatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
   * @returns GatewayWebsocket - Websocket connection
   */
  public connect(GatewayURL: string): ws {
    this.logger.write().debug({
      message: 'Creating New Gateway Connection',
      service: 'ClientConnection.connect',
    });
    this.GatewayWebsocket = new ws(GatewayURL + '/?v=6'); // Specify Version

    // Handle websocket events
    this.GatewayWebsocket.once('open', this.GatewayOpen);
    this.GatewayWebsocket.once('close', this.GatewayClose);
    this.GatewayWebsocket.once('error', this.GatewayError);
    this.GatewayWebsocket.on('message', this.GatewayMessage);

    return this.GatewayWebsocket;
  }

  /**
   * Send Message To Gateway Websocket Server
   * @param op - OpCode for message
   * @param data - message body
   */
  public send(op: number, data: any): void {
    const GatewayPackage: IDefaultDiscordGatewayPackage = {
      d: data,
      op,
    };

    if (this.GatewayWebsocket && this.GatewayWebsocket.readyState === ws.OPEN) {
      this.GatewayWebsocket.send(JSON.stringify(GatewayPackage));
      this.logger.write().debug({
        message: 'Successfully Sent A Message To Discord Gateway Server With OpCode: ' + op,
        service: 'ClientConnection.send',
      });
    } else {
      this.logger.write().error({
        details: GatewayPackage,
        message: new Error("Couldn't Send A Message To Discord Gateway Server"),
        service: 'ClientConnection.send',
      });
    }
  }

  public CanUseCompression(): boolean {
    return !!zlib.inflateSync;
  }

  public SetUserId(UserId: string): void {
    this.App.UserId = UserId;
  }

  /**
   * Handles GatewayWebsocket `error` event
   */
  private GatewayError(error: Error): void {
    this.logger.write().error({
      message: error,
      service: 'ClientConnection.GatewayWebsocket.GatewayError',
    });
  }

  /**
   * Handles GatewayWebsocket `close` event
   */
  private GatewayClose(): void {
    this.logger.write().warn({
      message: 'Connection to Gateway Server was Closed',
      service: 'ClientConnection.GatewayWebsocket.GatewayClose',
    });
    this.logger.write().info({
      message: 'Attempting to Reestablish Connection to Gateway Server',
      service: 'ClientConnection.GatewayWebsocket.GatewayClose',
    });

    // Attempt to resume the connection after 41 seconds
    clearInterval(this.GatewayHeartbeat);
    setTimeout(() => {
      this.resuming = true;
      this.connector.Reconnect();
    }, 5000);
  }

  /**
   * Handles GatewayWebsocket `open` event
   */
  private GatewayOpen(): void {
    this.logger.write().info({
      message: 'Successfully Connected to Gateway Server',
      service: 'ClientConnection.GatewayWebsocket.GatewayOpen',
    });
  }

  /**
   * Handles GatewayWebsocket `message` event
   * @param message - websocket message
   */
  private GatewayMessage(message: ws.Data): void {
    let data: IDefaultDiscordGatewayPackage;
    if (typeof message === 'string') {
      // message is json
      data = JSON.parse(message);
    } else {
      // message is buffer
      // @ts-ignore
      const extractedData: string = zlib.inflateSync(message).toString();
      data = JSON.parse(extractedData);
    }

    // Handle Receivable Messages OpCodes: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes

    switch (data.op) {
      case GATEWAY.DISPATCH: {
        this.dispatcher.Parse(data);
        break;
      }
      case GATEWAY.HEARTBEAT: {
        break;
      }
      case GATEWAY.RECONNECT: {
        clearInterval(this.GatewayHeartbeat);
        this.resuming = true;
        this.connector.Reconnect();
        break;
      }
      case GATEWAY.INVALID_SESSION: {
        if (data.d) {
          // Session is resumable
          clearInterval(this.GatewayHeartbeat);
          setTimeout(() => {
            this.resuming = true;
            this.connector.Reconnect();
          }, 5000);
        } else if (this.resuming) {
          // failed to resume, go through standard flow
          const simulatedHelloPayload: IDiscordHelloPackage = {
            _trace: [],
            heartbeat_interval: this.GatewayHeartbeatInterval,
          };
          setTimeout(() => {
            this.connector.Start(simulatedHelloPayload);
          }, 4000);
        } else {
          // Couldn't Initialise Session After Receiving OpCode 2 Identify
          this.logger.write().error({
            message: new Error(
              'Invalid Session Error: There was an error with the identify payload or the gateway has invalidated an active session',
            ),
            service: 'ClientConnection.GatewayWebsocket.GatewayMessage.INVALID_SESSION',
          });
        }
        break;
      }
      case GATEWAY.HELLO: {
        this.connector.Start(data.d);
        break;
      }
      case GATEWAY.HEARTBEAT_ACK: {
        this.connector.HeartbeatAcknowledged();
        break;
      }
      default: {
        this.logger.write().warn({
          message: 'Unhandled Gateway OpCode was received: ' + data.op,
          service: 'ClientConnection.GatewayWebsocket.GatewayMessage.UNHANDLED_OPCODE',
        });
        break;
      }
    }
  }
}
