import * as WebSocket from 'ws';
import DiscordClient from '../DiscordClient';
/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
    GatewayHeartbeat: number | undefined;
    GatewaySequence: number;
    GatewayPings: number[];
    GatewayPing: number;
    GatewaySessionId: string;
    GatewayHeartbeatInterval: number;
    GatewayProtocolVersion: number;
    resuming: boolean;
    GatewayWebsocket: WebSocket | undefined;
    private Client;
    private dispatcher;
    private connector;
    private GatewayURL?;
    private ExpectedClosure;
    /**
     * Create a new connection with discords gateway server
     * @param client - pass parent class as parameter to modify accessible vars and pass events through
     */
    constructor(client: DiscordClient);
    /**
     * Connect to discord gateway
     * @param LocalGatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
     * @returns GatewayWebsocket - Websocket connection
     */
    Connect(LocalGatewayURL?: string): boolean;
    /**
     * Disconnect from the discord gateway
     */
    Disconnect(): boolean;
    /**
     * Send Message To Gateway Websocket Server
     * @param op - OpCode for message
     * @param data - message body
     */
    send(op: number, data: any): boolean;
    SetStatus(status?: string, type?: number, state?: string): void;
    JoinVoiceChannel(GuildId: string, VoiceChannelId: string, mute?: boolean, deaf?: boolean): void;
    LeaveVoiceChannel(GuildId: string): void;
    CanUseCompression(): boolean;
    /**
     * Handles GatewayWebsocket `error` event
     */
    private GatewayError;
    /**
     * Handles GatewayWebsocket `close` event
     */
    private GatewayClose;
    /**
     * Handles GatewayWebsocket `open` event
     */
    private GatewayOpen;
    /**
     * Handles GatewayWebsocket `message` event
     * @param message - websocket message
     */
    private GatewayMessage;
}
