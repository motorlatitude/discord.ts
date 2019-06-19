import { IChannel, IChannelPinsUpdateEventObject, IDiscordChannelPinsUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class ChannelPinsUpdateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordChannelPinsUpdateGatewayEvent;

  public readonly EventName: string = 'CHANNEL_PINS_UPDATE';
  public EventObject: IChannelPinsUpdateEventObject | undefined;

  constructor(client: DiscordClient, message: IDiscordChannelPinsUpdateGatewayEvent) {
    super(client);

    this.Message = message;
  }

  public Handle(): void {
    if (this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          AffectedGuild.Channels.FetchAllTypes(this.Message.channel_id)
            .then((AffectedChannel: IChannel) => {
              if (AffectedChannel instanceof TextChannel) {
                this.EventObject = {
                  Channel: AffectedChannel,
                  Guild: AffectedGuild,
                  LastPinTimestamp: this.Message.last_pin_timestamp,
                };
                super.Handle();
              } else {
                this.Client.logger.write().error({
                  message: new Error('This channel cannot have a pinned message'),
                  service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
                });
              }
            })
            .catch((err: Error) => {
              this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
              });
            });
        })
        .catch((err: Error) => {
          this.Client.logger.write().error({
            message: err,
            service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
          });
        });
    } else {
      // DM
      this.Client.Channels.FetchAllTypes(this.Message.channel_id).then((AffectedChannel: IChannel) => {
        if (AffectedChannel instanceof TextChannel || AffectedChannel instanceof DirectMessageChannel) {
          this.EventObject = {
            Channel: AffectedChannel,
            LastPinTimestamp: this.Message.last_pin_timestamp,
          };
          super.Handle();
        } else {
          this.Client.logger.write().error({
            message: new Error('This channel cannot have a pinned message'),
            service: 'ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle',
          });
        }
      });
    }
  }

  public EmitEvent(): void {
    if (this.EventName === 'CHANNEL_PINS_UPDATE' && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }
}
