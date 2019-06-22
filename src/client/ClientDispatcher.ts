import Logger from '../common/Logger';
import { IDefaultDiscordGatewayPackage } from '../common/types';
import DiscordClient from '../DiscordClient';
import ClientConnection from './ClientConnection';
import ReadyEvent from './Events/ReadyEvent';

// Constants
import GATEWAY_EVENTS from '../common/constants/gatewayevents';
import ChannelEvent from './Events/ChannelEvent';
import ChannelPinsUpdateEvent from './Events/ChannelPinsUpdateEvent';
import GuildBanEvent from './Events/GuildBanEvent';
import GuildEmojisUpdateEvent from './Events/GuildEmojisUpdateEvent';
import GuildEvent from './Events/GuildEvent';
import GuildIntegrationEvent from './Events/GuildIntegrationEvent';
import GuildMemberEvent from './Events/GuildMemberEvent';
import GuildRoleEvent from './Events/GuildRoleEvent';
import MessageEvent from './Events/MessageEvent';
import MessageReactionEvent from './Events/MessageReactionEvent';

export default class ClientDispatcher {
  private readonly App: DiscordClient;
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
      case GATEWAY_EVENTS.READY: {
        const readyEvent = new ReadyEvent(this.App, message.d);
        readyEvent.Handle();
        break;
      }
      case GATEWAY_EVENTS.CHANNEL_CREATE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleCreate();
        break;
      }
      case GATEWAY_EVENTS.CHANNEL_UPDATE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleUpdate();
        break;
      }
      case GATEWAY_EVENTS.CHANNEL_DELETE: {
        const channel = new ChannelEvent(this.App, message.d);
        channel.HandleDelete();
        break;
      }
      case GATEWAY_EVENTS.CHANNEL_PINS_UPDATE: {
        const channelPins = new ChannelPinsUpdateEvent(this.App, message.d);
        channelPins.Handle();
        break;
      }
      case GATEWAY_EVENTS.GUILD_CREATE: {
        const guild = new GuildEvent(this.App);
        guild.HandleCreate(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_UPDATE: {
        const guild = new GuildEvent(this.App);
        guild.HandleUpdate(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_DELETE: {
        const guild = new GuildEvent(this.App);
        guild.HandleDelete(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_BAN_ADD: {
        const guildBan = new GuildBanEvent(this.App, message.d);
        guildBan.HandleBanAdd();
        break;
      }
      case GATEWAY_EVENTS.GUILD_BAN_REMOVE: {
        const guildBan = new GuildBanEvent(this.App, message.d);
        guildBan.HandleBanRemove();
        break;
      }
      case GATEWAY_EVENTS.GUILD_EMOJIS_UPDATE: {
        const guildEmoji = new GuildEmojisUpdateEvent(this.App, message.d);
        guildEmoji.Handle();
        break;
      }
      case GATEWAY_EVENTS.GUILD_INTEGRATIONS_UPDATE: {
        const guildIntegration = new GuildIntegrationEvent(this.App, message.d);
        guildIntegration.Handle();
        break;
      }
      case GATEWAY_EVENTS.GUILD_MEMBER_ADD: {
        const guildMemberEvent = new GuildMemberEvent(this.App);
        guildMemberEvent.HandleMemberAdd(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_MEMBER_REMOVE: {
        const guildMemberEvent = new GuildMemberEvent(this.App);
        guildMemberEvent.HandleMemberRemove(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_MEMBER_UPDATE: {
        const guildMemberEvent = new GuildMemberEvent(this.App);
        guildMemberEvent.HandleMemberUpdate(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_MEMBERS_CHUNK: {
        const guildMemberEvent = new GuildMemberEvent(this.App);
        guildMemberEvent.HandleMemberChunk(message.d);
        break;
      }
      case GATEWAY_EVENTS.GUILD_ROLE_CREATE: {
        const guildRoleEvent = new GuildRoleEvent(this.App, message.d);
        guildRoleEvent.HandleRoleCreate();
        break;
      }
      case GATEWAY_EVENTS.GUILD_ROLE_UPDATE: {
        const guildRoleEvent = new GuildRoleEvent(this.App, message.d);
        guildRoleEvent.HandleRoleUpdate();
        break;
      }
      case GATEWAY_EVENTS.GUILD_ROLE_DELETE: {
        const guildRoleEvent = new GuildRoleEvent(this.App, message.d);
        guildRoleEvent.HandleRoleDelete();
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_CREATE: {
        const messageEvent = new MessageEvent(this.App);
        messageEvent.HandleMessageCreate(message.d);
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_UPDATE: {
        const messageEvent = new MessageEvent(this.App);
        messageEvent.HandleMessageUpdate(message.d);
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_DELETE || GATEWAY_EVENTS.MESSAGE_DELETE_BULK: {
        const messageEvent = new MessageEvent(this.App);
        messageEvent.HandleMessageDelete(message.d);
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_REACTION_ADD: {
        const messageReactionEvent = new MessageReactionEvent(this.App, message.d);
        messageReactionEvent.HandleReactionAdd();
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_REACTION_REMOVE: {
        const messageReactionEvent = new MessageReactionEvent(this.App, message.d);
        messageReactionEvent.HandleReactionRemove();
        break;
      }
      case GATEWAY_EVENTS.MESSAGE_REACTION_REMOVE_ALL: {
        const messageReactionEvent = new MessageReactionEvent(this.App, message.d);
        messageReactionEvent.HandleReactionRemoveAll();
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
