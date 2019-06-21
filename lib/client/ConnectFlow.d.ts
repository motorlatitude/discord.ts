import Logger from '../common/Logger';
import ClientConnection from './ClientConnection';
import { IDiscordHelloPackage } from '../common/types';
export default class ConnectFlow {
    private logger;
    private connection;
    private readonly token;
    private GatewayHeartbeatSendTimestamp;
    private GatewayTotalPings;
    constructor(cc: ClientConnection, log: Logger, token: string);
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
