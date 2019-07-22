import * as WebSocket from 'ws';
import * as zlib from 'zlib';
import GATEWAY from '../common/constants/gateway';
import GATEWAY_ERRORS from '../common/constants/gatewayerrorcodes';
import { GatewayCloseCode, IDefaultDiscordGatewayPackage, IDiscordHelloPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnectFlow from './ClientConnectFlow';
import ClientDispatcher from './ClientDispatcher';

/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
  public GatewayHeartbeat: number | undefined;
  public GatewaySequence: number = 0;
  public GatewayPings: number[] = [];
  public GatewayPing: number = 0;
  public GatewaySessionId: string = '';
  public GatewayHeartbeatInterval: number = 0;
  public GatewayProtocolVersion: number = 6;

  public resuming: boolean = false;

  public GatewayWebsocket: WebSocket | undefined;

  private Client: DiscordClient;

  private dispatcher: ClientDispatcher;
  private connector: ClientConnectFlow;

  private GatewayURL?: string;

  private ExpectedClosure: boolean;

  /**
   * Create a new connection with discords gateway server
   * @param client - pass parent class as parameter to modify accessible vars and pass events through
   */
  constructor(client: DiscordClient) {
    this.Client = client;

    this.ExpectedClosure = false;

    this.dispatcher = new ClientDispatcher(client, this);
    this.connector = new ClientConnectFlow(client, this, client.token);
  }

  /**
   * Connect to discord gateway
   * @param LocalGatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
   * @returns GatewayWebsocket - Websocket connection
   */
  public Connect(LocalGatewayURL?: string): boolean {
    this.Client.logger.write().debug({
      message: 'Creating New Gateway Connection',
      service: 'ClientConnection.Connect',
    });
    if (LocalGatewayURL) {
      // LocalGatewayURL is not required when reconnecting, we use cached version
      // Additional Gateway URL Parameters as defined https://discordapp.com/developers/docs/topics/gateway#connecting-gateway-url-params
      this.GatewayURL =
        LocalGatewayURL + '/?v=6&encoding=json';
    }
    if (this.GatewayURL) {
      this.Client.logger.write().debug({
        message: this.GatewayURL,
        service: 'ClientConnection.Connect',
      });
      this.GatewayWebsocket = new WebSocket(this.GatewayURL);
      // Handle websocket events
      this.GatewayWebsocket.once('open', this.GatewayOpen.bind(this));
      this.GatewayWebsocket.once('close', this.GatewayClose.bind(this));
      this.GatewayWebsocket.once('error', this.GatewayError.bind(this));
      this.GatewayWebsocket.on('message', this.GatewayMessage.bind(this));
      return true;
    } else {
      this.Client.logger.write().error({
        message: "Couldn't find a valid gateway url",
        service: 'ClientConnection.Connect',
      });
      return false;
    }
  }

  /**
   * Disconnect from the discord gateway
   */
  public Disconnect(): boolean {
    if (this.GatewayWebsocket) {
      this.ExpectedClosure = true;
      clearInterval(this.GatewayHeartbeat);
      this.GatewayWebsocket.close();
      return true;
    } else {
      this.Client.logger.write().error({
        message: new Error("Can't close a connection that isn't available"),
        service: 'ClientConnection.Disconnect',
      });
      return false;
    }
  }

  /**
   * Send Message To Gateway Websocket Server
   * @param op - OpCode for message
   * @param data - message body
   */
  public send(op: number, data: any): boolean {
    const GatewayPackage: IDefaultDiscordGatewayPackage = {
      d: data,
      op,
    };

    if (this.GatewayWebsocket && this.GatewayWebsocket.readyState === WebSocket.OPEN) {
      this.GatewayWebsocket.send(JSON.stringify(GatewayPackage));
      this.Client.logger.write().debug({
        message: 'Successfully Sent A Message To Discord Gateway Server With OpCode: ' + op,
        service: 'ClientConnection.send',
      });
      return true;
    } else {
      this.Client.logger.write().warn({
        details: GatewayPackage,
        message: "Couldn't Send A Message To Discord Gateway Server: Socket Not Open",
        service: 'ClientConnection.send',
      });
      return false;
    }
  }

  public SetStatus(status: string = '', type: number = 2, state: string = 'online'): void {
    let since = null;
    let game = null;
    if (status) {
      game = {
        name: status,
        type,
      };
    }
    if (state === 'idle') {
      since = new Date().getTime();
    }
    const DataMessage = {
      afk: false,
      game,
      since,
      status: state,
    };
    this.send(GATEWAY.STATUS_UPDATE, DataMessage);
  }

  public JoinVoiceChannel(GuildId: string, VoiceChannelId: string, mute: boolean = false, deaf = false): void {
    const VoiceJoinPackage = {
      channel_id: VoiceChannelId,
      guild_id: GuildId,
      self_deaf: deaf,
      self_mute: mute,
    };
    this.send(GATEWAY.VOICE_STATE_UPDATE, VoiceJoinPackage);
  }

  public LeaveVoiceChannel(GuildId: string): void {
    const VoiceLeavePackage = {
      channel_id: null,
      guild_id: GuildId,
      self_deaf: false,
      self_mute: false,
    };
    this.send(GATEWAY.VOICE_STATE_UPDATE, VoiceLeavePackage);
  }

  public CanUseCompression(): boolean {
    return !!zlib.inflateSync;
  }

  /**
   * Handles GatewayWebsocket `error` event
   */
  private GatewayError(error: Error): void {
    this.Client.logger.write().error({
      message: error,
      service: 'ClientConnection.GatewayWebsocket.GatewayError',
    });
  }

  /**
   * Handles GatewayWebsocket `close` event
   */
  private GatewayClose(code?: GatewayCloseCode): void {
    if (code !== 4011 && !this.ExpectedClosure) {
      this.Client.logger.write().warn({
        message:
          'Connection to Gateway Server was Closed With Code: ' +
          code +
          '; ' +
          (code ? (GATEWAY_ERRORS[code] ? GATEWAY_ERRORS[code] : 'Unknown') : 'Unknown'),
        service: 'ClientConnection.GatewayWebsocket.GatewayClose',
      });

      this.Client.logger.write().info({
        message: 'Attempting to Reestablish Connection to Gateway Server',
        service: 'ClientConnection.GatewayWebsocket.GatewayClose',
      });

      // Attempt to resume the connection after 5 seconds
      clearInterval(this.GatewayHeartbeat);
      setTimeout(() => {
        this.resuming = true;
        this.Connect();
      }, 5000);
    } else if (this.ExpectedClosure) {
      this.Client.logger.write().info({
        message: 'Gateway Connection Successfully Closed',
        service: 'ClientConnection.GatewayWebsocket.GatewayClose',
      });
    } else {
      // Sharding required
    }
  }

  /**
   * Handles GatewayWebsocket `open` event
   */
  private GatewayOpen(): void {
    this.Client.logger.write().info({
      message: 'Successfully Connected to Gateway Server',
      service: 'ClientConnection.GatewayWebsocket.GatewayOpen',
    });
  }

  /**
   * Handles GatewayWebsocket `message` event
   * @param message - websocket message
   */
  private GatewayMessage(message: WebSocket.Data): void {
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
        // In the event that the server sends a heartbeat request, send heartbeat
        this.connector.SendHeartbeat();
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
            this.Connect();
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
          this.Client.logger.write().error({
            message: new Error(
              'Invalid Session Error: There was an error with the identify payload or the gateway has invalidated an active session',
            ),
            service: 'ClientConnection.GatewayWebsocket.GatewayMessage.INVALID_SESSION',
          });
        }
        break;
      }
      case GATEWAY.HELLO: {
        if (this.resuming) {
          this.connector.Reconnect();
        } else {
          this.connector.Start(data.d);
        }
        break;
      }
      case GATEWAY.HEARTBEAT_ACK: {
        this.connector.HeartbeatAcknowledged();
        break;
      }
      default: {
        this.Client.logger.write().warn({
          message: 'Unhandled Gateway OpCode was received: ' + data.op,
          service: 'ClientConnection.GatewayWebsocket.GatewayMessage.UNHANDLED_OPCODE',
        });
        break;
      }
    }
  }
}
