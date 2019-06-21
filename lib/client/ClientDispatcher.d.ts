import Logger from '../common/Logger';
import { IDefaultDiscordGatewayPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
export default class ClientDispatcher {
    private readonly App;
    private connection;
    private logger;
    constructor(app: DiscordClient, connection: ClientConnection, log: Logger);
    /**
     * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
     * @param message - message object
     */
    Parse(message: IDefaultDiscordGatewayPackage): void;
}
