/// <reference types="node" />
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import DiscordClient from '../../DiscordClient';
import VoiceConnection from '../VoiceConnection';
/**
 * Handles playing audio
 */
export default class AudioPlayer extends EventEmitter {
    Volume: number;
    Playing: boolean;
    private readonly SamplingRate;
    private readonly PacketizationSize;
    private readonly FrameSize;
    private readonly Client;
    private readonly VoiceConnection;
    private readonly AudioStream;
    private TemporaryAudioBuffer;
    private AudioChunks;
    private EncodedAudioChunks;
    private ConvertingDone;
    private Encoder;
    constructor(client: DiscordClient, vc: VoiceConnection, stream: Readable);
    Play(): void;
    Pause(): void;
    private ConvertStreamToS16LE;
    private EncodeAudioData;
    private SendAudioChunk;
    private SendEmptyPacket;
}
