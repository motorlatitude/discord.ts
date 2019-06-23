import * as WebSocket from 'ws';
import * as zlib from 'zlib';
import VOICE_ENDPOINT from '../common/constants/voiceendpoint';
import { IDefaultDiscordVoiceEndpointPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import Guild from '../resources/Guild/Guild';
import VoiceConnectFlow from './VoiceConnectFlow';
import VoiceUDPClient from './VoiceUDPClient';

/**
 * Handles Connection With the Discord Voice WebSocket Server
 */
export default class VoiceConnection {
  public readonly Token: string;
  public readonly Endpoint: string;
  public readonly SessionId: string;
  public readonly Guild: Guild;

  public UDPClient: VoiceUDPClient;

  private readonly Client: DiscordClient;

  private SSRC?: number;
  private IPAddress?: string;
  private Port?: number;
  private Modes?: string[];

  private LocalPort?: number;
  private LocalIPAddress?: string;

  private VoiceConnector: VoiceConnectFlow;
  private VoiceWebsocket?: WebSocket;

  /**
   * Initialise a new voice connection
   * @param client - the DiscordClient instance
   * @param guild - the Guild instance
   * @param token - Endpoint Token
   * @param endpoint - Endpoint URL
   * @param sessionId - The session id for the voice state
   * @constructor
   */
  constructor(client: DiscordClient, guild: Guild, token: string, endpoint: string, sessionId: string) {
    this.Client = client;
    this.Client.logger.write().debug({
      message: 'Creating a new VoiceConnection',
      service: 'DiscordClient.Guild.VoiceConnection',
    });
    this.Token = token;
    this.Endpoint = 'wss://' + endpoint + '?v=3'; // Set to version 3 (Recommended) https://discordapp.com/developers/docs/topics/voice-connections#voice-gateway-versioning-gateway-versions
    this.SessionId = sessionId;
    this.Guild = guild;

    this.VoiceConnector = new VoiceConnectFlow(this.Client, this);
    this.UDPClient = new VoiceUDPClient(this.Client);
  }

  /**
   * Connect To The Voice Endpoint
   */
  public Connect(): void {
    this.Client.logger.write().debug({
      message: 'Connecting a VoiceConnection',
      service: 'DiscordClient.Guild.VoiceConnection.Connect',
    });

    this.VoiceWebsocket = new WebSocket(this.Endpoint);

    // Handle voice websocket events
    this.VoiceWebsocket.once('open', this.VoiceWebsocketOpen.bind(this));
    this.VoiceWebsocket.once('close', this.VoiceWebsocketClose.bind(this));
    this.VoiceWebsocket.once('error', this.VoiceWebsocketError.bind(this));
    this.VoiceWebsocket.on('message', this.VoiceWebsocketMessage.bind(this));
  }

  /**
   * Send a message to the voice endpoint
   */
  public Send(op: number, d: any): void {
    const VoiceWebsocketPackage = {
      d,
      op,
    };

    if (this.VoiceWebsocket && this.VoiceWebsocket.readyState === WebSocket.OPEN) {
      this.VoiceWebsocket.send(JSON.stringify(VoiceWebsocketPackage));
      this.Client.logger.write().debug({
        message: 'Successfully Sent a Message to the Voice Endpoint With OpCode: ' + op,
        service: 'DiscordClient.Guild.VoiceConnection.send',
      });
    } else {
      this.Client.logger.write().warn({
        details: VoiceWebsocketPackage,
        message: "Couldn't Send a Message to the Voice Endpoint: Socket Not Open",
        service: 'DiscordClient.Guild.VoiceConnection.send',
      });
    }
  }

  /**
   * Set the connection's ssrc
   * @param NewSSRC - The new ssrc number
   */
  public SetSSRC(NewSSRC: number): number {
    this.SSRC = NewSSRC;
    return this.SSRC;
  }

  /**
   * Set the connection's IP Address and Port number
   * @param IPAddress - The new IP Address
   * @param Port - The new Port number
   */
  public SetIPAndPort(IPAddress: string, Port: number): string {
    this.IPAddress = IPAddress;
    this.Port = Port;
    return this.IPAddress + ':' + this.Port;
  }

  /**
   * Set the connection's mode
   * @param Modes - an array of strings defining possible modes, usually ["plain", "xsalsa20_poly1305"] - plain is no longer supported
   */
  public SetModes(Modes: string[]): string[] {
    this.Modes = Modes;
    return this.Modes;
  }

  /**
   * Set Local IP Address and Port
   * @param LocalIPAddress - Our IP Address
   * @param LocalPort - Our UDP Port
   */
  public SetLocalIPAndPort(LocalIPAddress: string, LocalPort: number): void {
    this.LocalIPAddress = LocalIPAddress;
    this.LocalPort = LocalPort;
  }

  /**
   * Handles Voice Endpoint Error
   * @param err - The Error reason why the connection was closed
   */
  private VoiceWebsocketError(err: Error): void {
    this.Client.logger.write().error({
      message: err,
      service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketError',
    });
  }

  /**
   * Handles Voice Endpoint Closure
   */
  private VoiceWebsocketClose(): void {
    this.Client.logger.write().warn({
      message: 'Connection to the Voice Endpoint was Closed',
      service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketClose',
    });
  }

  /**
   * Handles Voice Endpoint Opening
   */
  private VoiceWebsocketOpen(): void {
    this.Client.logger.write().debug({
      message: 'Successfully Connected to Voice Endpoint',
      service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketOpen',
    });

    // Start Connection Flow
    this.VoiceConnector.Start();
  }

  /**
   * Handles Voice Endpoint Message
   * @param Message - Data in the message
   */
  private VoiceWebsocketMessage(Message: WebSocket.Data): void {
    let data: IDefaultDiscordVoiceEndpointPackage;
    if (typeof Message === 'string') {
      // message is json
      data = JSON.parse(Message);
    } else {
      // message is buffer
      // @ts-ignore
      const extractedData: string = zlib.inflateSync(Message).toString();
      data = JSON.parse(extractedData);
    }

    this.Client.logger.write().debug({
      message: 'Received a Message From the Voice Endpoint With OpCode: ' + data.op,
      service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketMessage',
    });

    // Handle available OpCodes: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-opcodes

    switch (data.op) {
      case VOICE_ENDPOINT.READY: {
        this.VoiceConnector.Ready(data.d);
        break;
      }
      case VOICE_ENDPOINT.HELLO: {
        this.VoiceConnector.Hello(data.d);
        break;
      }
      default: {
        this.Client.logger.write().warn({
          message: 'Unhandled Voice Endpoint OpCode: ' + data.op,
          service: 'DiscordClient.Guild.VoiceConnection.VoiceWebsocketMessage',
        });
      }
    }
  }
}
