import * as WebSocket from 'ws';
import Logger from '../common/Logger';
import DiscordClient from '../DiscordClient';
/**
 * Handles Connection With The Discord Gateway Server
 */
export default class ClientConnection {
    static CanUseCompression(): boolean;
    GatewayHeartbeat: number | undefined;
    GatewayWebsocket: WebSocket | undefined;
    GatewaySequence: number;
    GatewayPings: number[];
    GatewayPing: number;
    GatewaySessionId: string;
    GatewayHeartbeatInterval: number;
    GatewayProtocolVersion: number;
    resuming: boolean;
    private App;
    private logger;
    private dispatcher;
    private connector;
    private GatewayURL?;
    /**
     * Create a new connection with discords gateway server
     * @param app - pass parent class as parameter to modify accessible vars and pass events through
     * @param log
     */
    constructor(app: DiscordClient, log: Logger);
    /**
     * Connect to discord gateway
     * @param LocalGatewayURL - Discord Gateway Url Retrieved From Discord Gateway Endpoint
     * @returns GatewayWebsocket - Websocket connection
     */
    connect(LocalGatewayURL?: string): WebSocket;
    /**
     * Send Message To Gateway Websocket Server
     * @param op - OpCode for message
     * @param data - message body
     */
    send(op: number, data: any): void;
    SetStatus(status?: string, type?: number, state?: string): void;
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
