import { IDiscordHelloVoiceEndpointPackage, IDiscordReadyVoiceEndpointPackage, IDiscordSessionDescriptionVoiceEndpointPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import VoiceConnection from './VoiceConnection';
export default class VoiceConnectFlow {
    VoiceHeartbeat?: number;
    VoiceHeartbeatInterval?: number;
    private VoicePings;
    private TotalVoicePings;
    private LastSentHeartbeat?;
    private ReceivedAcknowledgement?;
    private VoiceConnection;
    private Client;
    constructor(client: DiscordClient, voiceConnection: VoiceConnection);
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
    Start(): void;
    /**
     * Handles Voice Endpoint Ready OpCode
     */
    Ready(Message: IDiscordReadyVoiceEndpointPackage): void;
    /**
     * Initiate UDP Connection
     * @param IPAddress - Discords IP Address
     * @param Port - Discords Port
     * @param SSRC - The ssrc
     */
    ConnectToUDP(IPAddress: string, Port: number, SSRC: number): void;
    /**
     * Let Discord know our IP Address and Port and start receiving data
     * @param LocalIPAddress - Our External IP Address
     * @param LocalPort - Our External UDP Port
     */
    SelectProtocol(LocalIPAddress: string, LocalPort: number): void;
    /**
     * Handles Incoming Session Description
     * @param Message - OpCode 4 Session Description package
     */
    SessionDescription(Message: IDiscordSessionDescriptionVoiceEndpointPackage): void;
    /**
     * Handles HEARTBEAT_ACK - OpCode 6
     * @param Message - Timestamp Nonce
     */
    HeartbeatAcknowledgement(Message: number): void;
    /**
     * Handles Hello
     */
    Hello(Message: IDiscordHelloVoiceEndpointPackage): void;
    private Heartbeat;
}
