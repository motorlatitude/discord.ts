/// <reference types="node" />
import { EventEmitter } from 'events';
import DiscordClient from '../DiscordClient';
import Guild from '../resources/Guild/Guild';
import VoiceUDPClient from './VoiceUDPClient';
/**
 * Handles Connection With the Discord Voice WebSocket Server
 */
export default class VoiceConnection extends EventEmitter {
    readonly Token: string;
    readonly Endpoint: string;
    readonly SessionId: string;
    readonly Guild: Guild;
    UDPClient: VoiceUDPClient;
    VoiceReady?: boolean;
    Sequence: number;
    SSRC?: number;
    Timestamp: number;
    IPAddress?: string;
    Port?: number;
    Modes?: string[];
    protected Resuming: boolean;
    private readonly Client;
    private LocalPort?;
    private LocalIPAddress?;
    private VoiceConnector;
    private VoiceWebsocket?;
    private ExpectedClosure;
    /**
     * Initialise a new voice connection
     * @param client - the DiscordClient instance
     * @param guild - the Guild instance
     * @param token - Endpoint Token
     * @param endpoint - Endpoint URL
     * @param sessionId - The session id for the voice state
     * @constructor
     */
    constructor(client: DiscordClient, guild: Guild, token: string, endpoint: string, sessionId: string);
    /**
     * Connect To The Voice Endpoint
     */
    Connect(): void;
    /**
     * Gracefully Disconnect
     */
    Disconnect(): void;
    /**
     * Send a message to the voice endpoint
     */
    Send(op: number, d: any): void;
    /**
     * Set Speaking Mode
     * @param Speaking - Are we speaking; true or false, must be true BEFORE sending voice data
     */
    SetSpeaking(Speaking: boolean): void;
    /**
     * Set the connection's ssrc
     * @param NewSSRC - The new ssrc number
     */
    SetSSRC(NewSSRC: number): number;
    /**
     * Set the connection's IP Address and Port number
     * @param IPAddress - The new IP Address
     * @param Port - The new Port number
     */
    SetIPAndPort(IPAddress: string, Port: number): string;
    /**
     * Set the connection's mode
     * @param Modes - an array of strings defining possible modes, usually ["plain", "xsalsa20_poly1305"] - plain is no longer supported
     */
    SetModes(Modes: string[]): string[];
    /**
     * Set Local IP Address and Port
     * @param LocalIPAddress - Our IP Address
     * @param LocalPort - Our UDP Port
     */
    SetLocalIPAndPort(LocalIPAddress: string, LocalPort: number): void;
    /**
     * Handles Voice Endpoint Error
     * @param err - The Error reason why the connection was closed
     */
    private VoiceWebsocketError;
    /**
     * Handles Voice Endpoint Closure
     */
    private VoiceWebsocketClose;
    /**
     * Handles Voice Endpoint Opening
     */
    private VoiceWebsocketOpen;
    /**
     * Handles Voice Endpoint Message
     * @param Message - Data in the message
     */
    private VoiceWebsocketMessage;
}
