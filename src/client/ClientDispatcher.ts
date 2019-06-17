import Logger from '../common/Logger';
import ClientConnection from './ClientConnection';
import { DefaultDiscordGatewayPackage, DiscordDispatchDataPackage } from '../common/types';
import ReadyEvent from './Events/ReadyEvent';

//Constants
import GATEWAYEVENTS from '../common/constants/gatewayevents';

export default class ClientDispatcher {
  private connection: ClientConnection;
  private logger: Logger;

  constructor(connection: ClientConnection, log: Logger) {
    this.connection = connection;
    this.logger = log;
  }

  /**
   * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
   * @param message - message object
   */
  Parse(message: DefaultDiscordGatewayPackage): void {
    this.connection.GatewaySequence = message.s || 0;
    this.logger.write('[ClientDispatcher]: Received ' + message.t + ' Payload');

    let _this = this;
    switch (message.t) {
      case GATEWAYEVENTS.READY: {
        new ReadyEvent(_this.connection, message.d);
        break;
      }
      default: {
        _this.logger.write('[ClientDispatcher]: Received A Message That Is Not Handled: ' + message.t, 'warn');
        break;
      }
    }
  }
}
