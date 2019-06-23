import { IDiscordWebhooksUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class WebhooksUpdateEvent extends ClientDispatcherEvent {

  public readonly Message: IDiscordWebhooksUpdateGatewayEvent;

  public readonly EventName: 'WEBHOOKS_UPDATE' = 'WEBHOOKS_UPDATE';
  public EventGuildObject?: Guild;
  public EventChannelObject?: TextChannel;

  constructor(client: DiscordClient, msg: IDiscordWebhooksUpdateGatewayEvent){
    super(client);

    this.Message = msg;

  }

  /**
   * Handles WEBHOOKS_UPDATE
   * Sent when a guild channel's webhook is created, updated, or deleted.
   */
  public Handle(): void {

    this.EventGuildObject = this.Client.Guilds.Get(this.Message.guild_id);
    if(this.EventGuildObject){
      this.EventGuildObject.Channels.FetchTextChannel(this.Message.channel_id).then((AffectedChannel: TextChannel) => {
        this.EventChannelObject = AffectedChannel;

        super.Handle();
      })
    }

  }

  public EmitEvent(): void {
    if(this.EventChannelObject && this.EventGuildObject){
      this.Client.emit(this.EventName, this.EventChannelObject, this.EventGuildObject);
    }
  }

}