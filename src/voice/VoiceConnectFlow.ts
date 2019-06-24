import {
  IDiscordHelloVoiceEndpointPackage,
  IDiscordReadyVoiceEndpointPackage,
  IDiscordSessionDescriptionVoiceEndpointPackage,
} from '../common/types';
import DiscordClient from '../DiscordClient';
import VOICE_ENDPOINT from './../common/constants/voiceendpoint';
import VoiceConnection from './VoiceConnection';

export default class VoiceConnectFlow {
  public VoiceHeartbeat?: number;
  public VoiceHeartbeatInterval?: number;

  private VoiceConnection: VoiceConnection;
  private Client: DiscordClient;

  constructor(client: DiscordClient, voiceConnection: VoiceConnection) {
    this.VoiceConnection = voiceConnection;
    this.Client = client;
  }

  /**
   * Start the Voice Connection Flow
   * 1.
   * Identify ->
   *    Ready <-
   * 2.
   * ConnectToUDP ->
   * IP Discovery <-
   * 3.
   *     SelectProtocol ->
   * SessionDescription <-
   */
  public Start(): void {
    if (this.Client.User) {
      const IdentifyPackage = {
        server_id: this.VoiceConnection.Guild.id,
        session_id: this.VoiceConnection.SessionId,
        token: this.VoiceConnection.Token,
        user_id: this.Client.User.id,
      };

      // Send Identify Package; OpCode 0
      // https://discordapp.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection-example-voice-identify-payload
      this.VoiceConnection.Send(VOICE_ENDPOINT.IDENTIFY, IdentifyPackage);
    }
  }

  /**
   * Handles Voice Endpoint Ready OpCode
   */
  public Ready(Message: IDiscordReadyVoiceEndpointPackage): void {
    this.VoiceConnection.SetSSRC(Message.ssrc);
    this.VoiceConnection.SetIPAndPort(Message.ip, Message.port);
    this.VoiceConnection.SetModes(Message.modes);

    this.ConnectToUDP(Message.ip, Message.port, Message.ssrc);
  }

  /**
   * Initiate UDP Connection
   * @param IPAddress - Discords IP Address
   * @param Port - Discords Port
   * @param SSRC - The ssrc
   */
  public ConnectToUDP(IPAddress: string, Port: number, SSRC: number): void {
    this.VoiceConnection.UDPClient.on('READY', () => {
      if (this.VoiceConnection.UDPClient && SSRC) {
        // Start IP Discovery Process
        this.VoiceConnection.UDPClient.GetLocalInformation(SSRC);
      }
    });
    this.VoiceConnection.UDPClient.on('IP_DISCOVERY_DONE', (LocalIPAddress: string, LocalPort: number) => {
      this.VoiceConnection.SetLocalIPAndPort(LocalIPAddress, LocalPort);
      this.SelectProtocol(LocalIPAddress, LocalPort);
    });
    this.VoiceConnection.UDPClient.Connect(Port, IPAddress);
  }

  /**
   * Let Discord know our IP Address and Port and start receiving data
   * @param LocalIPAddress - Our External IP Address
   * @param LocalPort - Our External UDP Port
   */
  public SelectProtocol(LocalIPAddress: string, LocalPort: number): void {
    this.VoiceConnection.Send(VOICE_ENDPOINT.SELECT_PROTOCOL, {
      data: {
        address: LocalIPAddress,
        mode: 'xsalsa20_poly1305', // currently only supported mode
        port: LocalPort,
      },
      protocol: 'udp',
    });
  }

  /**
   * Handles Incoming Session Description
   * @param Message - OpCode 4 Session Description package
   */
  public SessionDescription(Message: IDiscordSessionDescriptionVoiceEndpointPackage): void {
    if (Message.mode === 'xsalsa20_poly1305') {
      this.VoiceConnection.UDPClient.SecretKey = Message.secret_key;
      // we're ready to send voice data now
      this.VoiceConnection.VoiceReady = true;
      this.VoiceConnection.emit("VOICE_READY");
    } else {
      this.Client.logger.write().warn({
        message: 'Unsupported Voice Mode',
        service: 'VoiceConnection.VoiceConnectFlow.SessionDescription',
      });
    }
  }

  /**
   * Handles Hello
   */
  public Hello(Message: IDiscordHelloVoiceEndpointPackage): void {
    this.VoiceHeartbeatInterval = Message.heartbeat_interval * 0.75; // WARN - bug in discords Hello payload interval

    // Start Heartbeat
    // @ts-ignore
    this.VoiceHeartbeat = setInterval(() => {
      this.VoiceConnection.Send(VOICE_ENDPOINT.HEARTBEAT, new Date().getTime());
    }, this.VoiceHeartbeatInterval);
  }
}
