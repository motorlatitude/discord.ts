import * as Datagram from 'dgram';
import { EventEmitter } from 'events';
import * as nacl from 'tweetnacl';
import DiscordClient from '../DiscordClient';
import VoiceConnection from './VoiceConnection';

/**
 * Handles connection to discord voice UDP server
 */
export default class VoiceUDPClient extends EventEmitter {
  public SecretKey?: number[];

  public ReadyState: boolean;

  private UDPConnection: any;
  private IPDiscoveryDone: boolean;

  private Client: DiscordClient;

  private VoiceConnection: VoiceConnection;

  constructor(client: DiscordClient, vc: VoiceConnection) {
    super();
    this.Client = client;
    this.VoiceConnection = vc;

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

  public SendAudioPacket(Data: any): void {
    if (this.VoiceConnection.SSRC) {
      const mac = this.SecretKey ? 16 : 0;
      const PackageLength = Data.length + 12 + mac;

      let AudioBuffer = Data;
      const EncryptedBuffer = Buffer.alloc(PackageLength, 0);

      EncryptedBuffer[0] = 0x80;
      EncryptedBuffer[1] = 0x78;

      EncryptedBuffer.writeUIntBE(this.VoiceConnection.Sequence, 2, 2);
      EncryptedBuffer.writeUIntBE(this.VoiceConnection.Timestamp, 4, 4);
      EncryptedBuffer.writeUIntBE(this.VoiceConnection.SSRC, 8, 4);

      if (this.SecretKey) {
        const nonce = Buffer.alloc(24, 0);
        EncryptedBuffer.copy(nonce, 0, 0, 12);
        AudioBuffer = nacl.secretbox(new Uint8Array(Data), new Uint8Array(nonce), new Uint8Array(this.SecretKey));
      }

      for (let i = 0; i < AudioBuffer.length; i++) {
        EncryptedBuffer[i + 12] = AudioBuffer[i];
      }
      this.Send(EncryptedBuffer, 0, EncryptedBuffer.length);
    }
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

  private DatagramSocketMessage(Message: Buffer): void {
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
