import { EventEmitter } from 'events';
import * as FluentFFMPEG from 'fluent-ffmpeg';
// @ts-ignore
import * as NodeOpus from 'node-opus';
import { Readable } from 'stream';
import DiscordClient from '../../DiscordClient';
import VoiceConnection from '../VoiceConnection';
/**
 * Handles playing audio
 */
export default class AudioPlayer extends EventEmitter {
  public Volume: number = 0.5;
  public Playing: boolean = false;

  private readonly Client: DiscordClient;

  private readonly VoiceConnection: VoiceConnection;

  private readonly AudioStream: Readable;

  private TemporaryAudioBuffer: Buffer;
  private AudioChunks: Buffer[];
  private EncodedAudioChunks: Buffer[];

  private ConvertingDone: boolean = false;

  private Encoder: any;

  constructor(client: DiscordClient, vc: VoiceConnection, stream: Readable) {
    super();

    this.Client = client;
    this.VoiceConnection = vc;
    this.AudioStream = stream;

    this.TemporaryAudioBuffer = Buffer.alloc(0);
    this.AudioChunks = [];
    this.EncodedAudioChunks = [];
    if(NodeOpus){
      this.Encoder = new NodeOpus.OpusEncoder(48000, 2);
    }
    else{
      this.Client.logger.write().error({
        message: new Error("node-opus is not installed or properly configured"),
        service: "VoiceManager.AudioPlayer"
      })
    }

    this.ConvertStreamToS16LE();
  }

  public Play(): void {
    this.VoiceConnection.SetSpeaking(true);
    this.Playing = true;
    this.SendAudioChunk(new Date().getTime(), 0);
    this.emit('PLAYING');
  }

  public Pause(): void {
    this.Playing = false;
    this.SendEmptyPacket();
    this.VoiceConnection.SetSpeaking(false);
    this.emit('PAUSED');
  }

  private ConvertStreamToS16LE(): void {
    const cmd = FluentFFMPEG(this.AudioStream)
      .audioChannels(2)
      .audioBitrate(48)
      .format('s16le')
      .on('error', (err: Error) => {
        // event
        this.Client.logger.write().error({
          message:err,
          service: "VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg"
        })
      })
      .on('progress', (ProgressObject: any) => {
        // event
        this.Client.logger.write().debug({
          message: "Progress: "+ProgressObject.percent + " : "+ProgressObject.timemark,
          service: "VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg"
        })
      })
      .on('end', () => {
        // event
        this.ConvertingDone = true;
        this.Client.logger.write().debug({
          message: "Audio Stream Input has completely been converted",
          service: "VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg"
        })
      });

    const AudioOutStream = cmd.pipe();
    let IsFirstPacket: boolean = true;
    AudioOutStream.on('data', (chunk: Buffer) => {
      this.TemporaryAudioBuffer = Buffer.concat([this.TemporaryAudioBuffer, chunk]);

      // split data into chunks
      const ChunkSize = 1920*2;
      const totalLength = this.TemporaryAudioBuffer.length;
      const remainder = totalLength % ChunkSize;
      const cutoff = totalLength - remainder;
      for (let i = 0; i < cutoff; i += ChunkSize) {
        this.AudioChunks.push(this.TemporaryAudioBuffer.slice(i, i + ChunkSize));
      }
      this.TemporaryAudioBuffer = this.TemporaryAudioBuffer.slice(cutoff, totalLength);

      // send to encode
      if(IsFirstPacket){
        this.EncodeAudioData();
        IsFirstPacket = false;
      }
    });
  }

  private EncodeAudioData(): void {
    const Packet = this.AudioChunks.shift();
    if (Packet) {
      const OutBuffer = Buffer.alloc(Packet.length);
      let i = 0;
      while (i < Packet.length) {
        if (i >= Packet.length - 1) {
          break;
        }
        const Multiplier = Math.pow(this.Volume, 1.660964);
        let UINT = Math.floor(Multiplier * Packet.readInt16LE(i));
        if (UINT > 32767 || UINT < -32767) {
          this.Volume -= 0.05; // PEAKING - lower volume
        }
        UINT = Math.min(32767, UINT);
        UINT = Math.max(-32767, UINT);
        OutBuffer.writeInt16LE(UINT, i);
        i += 2;
      }
      const output = this.Encoder.encode(OutBuffer, 960)
      this.EncodedAudioChunks.push(output);
      this.EncodeAudioData();
    }
    else if(!this.ConvertingDone){
      setTimeout(() => {
        this.EncodeAudioData();
      }, 20);
    }
  }

  private SendAudioChunk(StartTime: number, Count: number): void {
    const SamplingInstance = 960;
    if(this.Playing){
      const Packet = this.EncodedAudioChunks.shift();
      if (Packet) {
        this.VoiceConnection.Sequence = this.VoiceConnection.Sequence + 1 < 65535 ? this.VoiceConnection.Sequence + 1 : 0;
        this.VoiceConnection.Timestamp =
          this.VoiceConnection.Timestamp + SamplingInstance < 4294967295
            ? this.VoiceConnection.Timestamp + SamplingInstance
            : 0;

        this.VoiceConnection.UDPClient.SendAudioPacket(Packet);

        const NextTime = StartTime + (Count + 1) * 20
        setTimeout(() => {
          this.SendAudioChunk(StartTime, Count + 1)
        }, 20 + (NextTime - new Date().getTime()));
      }
      else{
        setTimeout(() => {
          this.SendAudioChunk(StartTime, Count)
        }, 200);
      }
    }
  }

  private SendEmptyPacket(): void {
    const EmptyPacket = Buffer.from('F8FFFE', 'hex');
    this.VoiceConnection.UDPClient.SendAudioPacket(EmptyPacket);
  }
}
