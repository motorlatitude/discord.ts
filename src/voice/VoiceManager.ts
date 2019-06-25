import * as fs from 'fs';
import DiscordClient from '../DiscordClient';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import VoiceConnection from './VoiceConnection';

/**
 * Interfaces between Developer and Voice Connection
 */
export default class VoiceManager {
  public readonly VoiceConnection: VoiceConnection;

  private readonly Client: DiscordClient;

  constructor(client: DiscordClient, vc: VoiceConnection) {
    this.Client = client;
    this.VoiceConnection = vc;
  }

  public PlayStream(Stream: any): AudioPlayer {
    return new AudioPlayer(this.Client, this.VoiceConnection, Stream);
  }

  public PlayFile(FilePath: string): AudioPlayer {
    const readStream = fs.createReadStream(FilePath);
    return this.PlayStream(readStream);
  }
}
