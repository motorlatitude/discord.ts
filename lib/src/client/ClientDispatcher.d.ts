import { IDefaultDiscordGatewayPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
export default class ClientDispatcher {
    private readonly Client;
    private connection;
    constructor(client: DiscordClient, connection: ClientConnection);
    /**
     * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
     * @param message - message object
     */
    Parse(message: IDefaultDiscordGatewayPackage): void;
}
