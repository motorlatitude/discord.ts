//Node Modules
import * as zlib from 'zlib';

//NPM Modules
import * as ws from 'ws';

import { DiscordClient } from '../index';
import Logger from '../common/Logger';
import ClientDispatcher from './ClientDispatcher';
import ConnectFlow from './ConnectFlow';

//Types
import { DefaultDiscordGatewayPackage, DiscordHelloPackage } from '../common/types';

//Constants
import GATEWAY from '../common/constants/gateway';

/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
  private App: DiscordClient;
  private logger: Logger;

  private dispatcher: ClientDispatcher;
  private connector: ConnectFlow;

  public GatewayHeartbeat: number | undefined;
  public GatewayWebsocket: ws | undefined;
  public GatewaySequence: number = 0;
  public GatewayPings: number[] = [];
  public GatewayPing: number = 0;
  public GatewaySessionId: string = '';
  public GatewayHeartbeatInterval: number = 0;
  public GatewayProtocolVersion: number = 6;

  private resuming: boolean = false;

  /**
   * Create a new connection with discords gateway server
   * @param app - pass parent class as parameter to modify accessible vars and pass events through
   */
  constructor(app: DiscordClient, log: Logger) {
    this.App = app;
    this.logger = log;

    this.dispatcher = new ClientDispatcher(this, log);
    this.connector = new ConnectFlow(this, log, app.token);
  }

  /**
   * Connect to discord gateway
   * @param gateway_url - Discord Gateway Url Retrieved From Discord Gateway Endpoint
   * @returns GatewayWebsocket - Websocket connection
   */
  public connect(gateway_url: string): ws {
    this.logger.write('[ClientConnection]: Creating New Gateway Connection');
    this.GatewayWebsocket = new ws(gateway_url + '/?v=6'); //specify version

    //handle websocket events
    let _this = this;
    this.GatewayWebsocket.once('open', _this.GatewayOpen);
    this.GatewayWebsocket.once('close', _this.GatewayClose);
    this.GatewayWebsocket.once('error', _this.GatewayError);
    this.GatewayWebsocket.on('message', _this.GatewayMessage);

    return this.GatewayWebsocket;
  }

  /**
   * Send Message To Gateway Websocket Server
   * @param op - opcode for message
   * @param data - message body
   */
  public send(op: number, data: any): void {
    let GatewayPackage: DefaultDiscordGatewayPackage = {
      op: op,
      d: data,
    };

    if (this.GatewayWebsocket && this.GatewayWebsocket.readyState == ws.OPEN) {
      this.GatewayWebsocket.send(JSON.stringify(GatewayPackage));
      this.logger.write('[ClientConnection]: Successfully Sent A Message To Discord Gateway Server With Opcode: ' + op);
    } else {
      this.logger.write("[ClientConnection]: Couldn't Send A Message To Discord Gateway Server", 'error');
      console.log(GatewayPackage);
    }
  }

  public EmitEventListenerEvent(type: string, data: any): void {
    this.App.emit(type, data);
  }

  public CanUseCompression(): boolean {
    return !!zlib.inflateSync;
  }

  public SetUserId(user_id: string): void {
    this.App.UserId = user_id;
  }

  /**
   * Handles GatewayWebsocket `error` event
   */
  private GatewayError(error: Error): void {
    this.logger.write(
      '[ClientConnection]: Error Occurred With the Gateway Server Connection: ' + error.toString(),
      'error',
    );
  }

  /**
   * Handles GatewayWebsocket `close` event
   */
  private GatewayClose(): void {
    this.logger.write('[ClientConnection]: Connection to Gateway Server was Closed', 'warn');
    this.logger.write('[ClientConnection]: Attempting to Reestablish Connection to Gateway Server', 'info');

    //attempt to resume the connection after 41 seconds
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
    this.logger.write('[ClientConnection]: Successfully Connected to Gateway Server', 'info');
  }

  /**
   * Handles GatewayWebsocket `message` event
   * @param message - websocket message
   */
  private GatewayMessage(message: ws.Data): void {
    let data: DefaultDiscordGatewayPackage;
    if (typeof message == 'string') {
      //message is json
      data = JSON.parse(message);
    } else {
      //message is buffer
      // @ts-ignore
      let extractedData: string = zlib.inflateSync(message).toString();
      data = JSON.parse(extractedData);
    }

    // Handle Receivable Messages OpCodes: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
    let _this = this;
    switch (data.op) {
      case GATEWAY.DISPATCH: {
        _this.dispatcher.Parse(data);
        break;
      }
      case GATEWAY.HEARTBEAT: {
        break;
      }
      case GATEWAY.RECONNECT: {
        clearInterval(_this.GatewayHeartbeat);
        _this.resuming = true;
        _this.connector.Reconnect();
        break;
      }
      case GATEWAY.INVALID_SESSION: {
        if (data.d) {
          // Session is resumable
          clearInterval(_this.GatewayHeartbeat);
          setTimeout(() => {
            _this.resuming = true;
            _this.connector.Reconnect();
          }, 5000);
        } else if (_this.resuming) {
          //failed to resume, go through standard flow
          let simulatedHelloPayload: DiscordHelloPackage = {
            heartbeat_interval: _this.GatewayHeartbeatInterval,
            _trace: [],
          };
          setTimeout(() => {
            _this.connector.Start(simulatedHelloPayload);
          }, 4000);
        } else {
          // Couldn't Initialise Session After Receiving Opcode 2 Identify
          _this.logger.write(
            '[ClientConnection]: Invalid Session Error: There was an error with the identify payload or the gateway has invalidated an active session',
          );
        }
        break;
      }
      case GATEWAY.HELLO: {
        _this.connector.Start(data.d);
        break;
      }
      case GATEWAY.HEARTBEAT_ACK: {
        _this.connector.HeartbeatAcknowledged();
        break;
      }
      default: {
        _this.logger.write('[ClientConnection]: Unhandled Gateway OpCode was received: ' + data.op, 'warn');
        break;
      }
    }
  }
}
