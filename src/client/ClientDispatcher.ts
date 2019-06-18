import Logger from '../common/Logger';
import { IDefaultDiscordGatewayPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
import ReadyEvent from './Events/ReadyEvent';

// Constants
import GATEWAYEVENTS from '../common/constants/gatewayevents';
import ChannelEvents from './Events/ChannelEvents';

export default class ClientDispatcher {
  private App: DiscordClient;
  private connection: ClientConnection;
  private logger: Logger;

  constructor(app: DiscordClient, connection: ClientConnection, log: Logger) {
    this.App = app;
    this.connection = connection;
    this.logger = log;
  }

  /**
   * Parse Discord Dispatch message, these are GatewayWebsocket messages with opcode 0
   * @param message - message object
   */
  public Parse(message: IDefaultDiscordGatewayPackage): void {
    this.connection.GatewaySequence = message.s || 0;
    this.logger.write().debug({
      message: 'Received ' + message.t + ' Payload',
      service: 'ClientConnection.ClientDispatcher.Parse',
    });

    switch (message.t) {
      case GATEWAYEVENTS.READY: {
        const readyEvent = new ReadyEvent(this.App, message.d);
        readyEvent.Handle();
        break;
      }
      case GATEWAYEVENTS.CHANNEL_CREATE: {
        const channel = new ChannelEvents(this.App, message.d);
        channel.HandleCreate();
        break;
      }
      default: {
        this.logger.write().warn({
          message: 'Received A Message That Is Not Handled: ' + message.t,
          service: 'ClientConnection.ClientDispatcher.Parse.UNHANDLED_MESSAGE_TYPE',
        });
        break;
      }
    }
  }
}
