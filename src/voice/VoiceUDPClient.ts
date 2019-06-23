import * as Datagram from 'dgram';
import { EventEmitter } from 'events';
import DiscordClient from '../DiscordClient';

/**
 * Handles connection to discord voice UDP server
 */
export default class VoiceUDPClient extends EventEmitter {
  public SecretKey?: number[];

  private UDPConnection: any;

  private ReadyState: boolean;
  private IPDiscoveryDone: boolean;

  private Client: DiscordClient;

  constructor(client: DiscordClient) {
    super();
    this.Client = client;

    this.ReadyState = false;
    this.IPDiscoveryDone = false;
  }

  public Connect(Port: number, Address: string): void {
    this.UDPConnection = Datagram.createSocket('udp4');

    this.UDPConnection.on('listening', this.DatagramSocketListening.bind(this));
    this.UDPConnection.on('error', this.DatagramSocketError.bind(this));
    this.UDPConnection.on('close', this.DatagramSocketClose.bind(this));
    this.UDPConnection.on('connect', this.DatagramSocketConnect.bind(this));
    this.UDPConnection.on('message', this.DatagramSocketMessage.bind(this));

    this.UDPConnection.connect(Port, Address); // Requires NodeJS v12.0.0
  }

  public GetLocalInformation(ssrc: number): void {
    this.Client.logger.write().info({
      message: 'Starting IP Discovery',
      service: 'VoiceConnection.VoiceUDPClient.GetLocalInformation',
    });
    const InitPackage = Buffer.alloc(70);
    InitPackage.writeUIntBE(ssrc, 0, 4);
    this.Send(InitPackage, 0, InitPackage.length);
  }

  private Send(Message: Buffer, Offset: number, Length: number): void {
    if (this.ReadyState) {
      this.UDPConnection.send(Message, Offset, Length);
    }
  }

  private DatagramSocketConnect(): void {
    this.Client.logger.write().debug({
      message: 'Voice UDP Client has successfully connected',
      service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketError',
    });

    this.ReadyState = true;
    this.emit('READY');
  }

  private DatagramSocketError(err: Error): void {
    this.ReadyState = false;

    this.Client.logger.write().error({
      message: err,
      service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketError',
    });
  }

  private DatagramSocketClose(): void {
    this.ReadyState = false;
    this.Client.logger.write().warn({
      message: 'Voice UDP Client Connection was Closed',
      service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketClose',
    });
  }

  private DatagramSocketListening(): void {
    if (this.UDPConnection) {
      const address: any = this.UDPConnection.address();
      this.Client.logger.write().info({
        message: 'Voice UDP Client is listening on ' + address.address + ':' + address.port,
        service: 'DiscordClient.Guild.VoiceUDPClient.DatagramSocketListening',
      });
    }
  }

  private DatagramSocketMessage(Message: Buffer, RemoteAddressInformation: any): void {
    if (this.IPDiscoveryDone) {
      // Handle packets maybe?
    } else {
      let LocalIP: string = '';
      const LocalPort: number = parseInt(Message.readUIntLE(Message.length - 2, 2).toString(10), 10);
      const Packet = Buffer.from(Message);
      for (let i = 4; i < Packet.indexOf(0, i); i++) {
        LocalIP += String.fromCharCode(Packet[i]);
      }

      this.Client.logger.write().info({
        message: 'IP Discovery Done - ' + LocalIP + ':' + LocalPort,
        service: 'VoiceConnection.VoiceUDPClient.DatagramSocketMessage',
      });

      this.emit('IP_DISCOVERY_DONE', LocalIP, LocalPort);

      this.IPDiscoveryDone = true;
    }
  }
}
