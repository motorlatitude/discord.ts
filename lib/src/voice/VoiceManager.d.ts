import DiscordClient from '../DiscordClient';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import VoiceConnection from './VoiceConnection';
/**
 * Interfaces between Developer and Voice Connection
 */
export default class VoiceManager {
    readonly VoiceConnection: VoiceConnection;
    private readonly Client;
    constructor(client: DiscordClient, vc: VoiceConnection);
    PlayStream(Stream: any): AudioPlayer;
    PlayFile(FilePath: string): AudioPlayer;
}
