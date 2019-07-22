import { IDiscordHelloPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
export default class ClientConnectFlow {
    private readonly Client;
    private Connection;
    private readonly Token;
    private GatewayHeartbeatSendTimestamp;
    private GatewayTotalPings;
    constructor(client: DiscordClient, cc: ClientConnection, token: string);
    /**
     * Start Connection Flow Once Hello Payload Received From Discord
     * @param HelloPackage - the hello package with opcode 10
     */
    Start(HelloPackage: IDiscordHelloPackage): void;
    /**
     * Sent Heartbeat has been acknowledged and returned
     */
    HeartbeatAcknowledged(): void;
    /**
     * Attempt to reconnect to discord gateway server by resuming the connection
     */
    Reconnect(): void;
    /**
     * Sends Identify package to Discord Gateway Websocket server
     */
    private SendIdentifyPayload;
}
