import Logger from '../common/Logger';
import { IDefaultDiscordGatewayPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
import ReadyEvent from './Events/ReadyEvent';

// Constants
import GATEWAYEVENTS from '../common/constants/gatewayevents';
import ChannelEvent from './Events/ChannelEvent';
import ChannelPinsUpdateEvent from './Events/ChannelPinsUpdateEvent';
import GuildBanEvent from './Events/GuildBanEvent';
import GuildEvent from './Events/GuildEvent';

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
      message: 'Received ' + message.t + ' Event',
      service: 'ClientConnection.ClientDispatcher.Parse',
    });

    switch (message.t) {
      case GATEWAYEVENTS.READY: {
        const readyEvent = new ReadyEvent(this.App, message.d);
        readyEvent.Handle();
        break;
      }
      case GATEWAYEVENTS.CHANNEL_CREATE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleCreate();
        break;
      }
      case GATEWAYEVENTS.CHANNEL_UPDATE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleUpdate();
        break;
      }
      case GATEWAYEVENTS.CHANNEL_DELETE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleDelete();
        break;
      }
      case GATEWAYEVENTS.CHANNEL_PINS_UPDATE: {
        const channelPins = new ChannelPinsUpdateEvent(this.App, message.d);
        channelPins.Handle();
        break;
      }
      case GATEWAYEVENTS.GUILD_CREATE: {
        const guild = new GuildEvent(this.App);
        guild.HandleCreate(message.d);
        break;
      }
      case GATEWAYEVENTS.GUILD_UPDATE: {
        const guild = new GuildEvent(this.App);
        guild.HandleUpdate(message.d);
        break;
      }
      case GATEWAYEVENTS.GUILD_DELETE: {
        const guild = new GuildEvent(this.App);
        guild.HandleDelete(message.d);
        break;
      }
      case GATEWAYEVENTS.GUILD_BAN_ADD: {
        const guildBan = new GuildBanEvent(this.App, message.d);
        guildBan.HandleBanAdd();
        break;
      }
      case GATEWAYEVENTS.GUILD_BAN_REMOVE: {
        const guildBan = new GuildBanEvent(this.App, message.d);
        guildBan.HandleBanRemove();
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
