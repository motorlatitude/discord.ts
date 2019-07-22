/// <reference types="node" />
import { EventEmitter } from 'events';
import DiscordClient from '../DiscordClient';
import VoiceConnection from './VoiceConnection';
/**
 * Handles connection to discord voice UDP server
 */
export default class VoiceUDPClient extends EventEmitter {
    SecretKey?: number[];
    ReadyState: boolean;
    private UDPConnection;
    private IPDiscoveryDone;
    private Client;
    private VoiceConnection;
    constructor(client: DiscordClient, vc: VoiceConnection);
    Connect(Port: number, Address: string): void;
    GetLocalInformation(ssrc: number): void;
    SendAudioPacket(Data: any): void;
    private Send;
    private DatagramSocketConnect;
    private DatagramSocketError;
    private DatagramSocketClose;
    private DatagramSocketListening;
    private DatagramSocketMessage;
}
