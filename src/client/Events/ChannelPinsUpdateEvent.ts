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

  public Handle(): Promise<IChannelPinsUpdateEventObject> {
    return new Promise((resolve, reject) => {
      if (this.Message.guild_id) {
        this.GuildBasedChannel(this.Message.guild_id)
          .then((res: IChannelPinsUpdateEventObject) => {
            resolve(res);
          })
          .catch((err: Error) => {
            reject(err);
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
            resolve(this.EventObject);
          } else {
            const ErrorResponse = new Error('This channel cannot have a pinned message');
            reject(ErrorResponse);
          }
        });
      }
    });
  }

  public EmitEvent(): void {
    if (this.EventName === 'CHANNEL_PINS_UPDATE' && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }

  /**
   * Handles Pins Update in Guild
   * @param GuildId - the id of the relevant guild
   */
  private GuildBasedChannel(GuildId: string): Promise<IChannelPinsUpdateEventObject> {
    return new Promise((resolve, reject) => {
      let AffectedGuild: Guild;
      this.Client.Guilds.Fetch(GuildId)
        .then((FoundGuild: Guild) => {
          AffectedGuild = FoundGuild;
          return AffectedGuild.Channels.FetchAllTypes(this.Message.channel_id);
        })
        .then((AffectedChannel: IChannel) => {
          if (AffectedChannel instanceof TextChannel) {
            this.EventObject = {
              Channel: AffectedChannel,
              Guild: AffectedGuild,
              LastPinTimestamp: this.Message.last_pin_timestamp,
            };
            super.Handle();
            resolve(this.EventObject);
          } else {
            const ErrorResponse = new Error('This channel cannot have a pinned message');
            reject(ErrorResponse);
          }
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
}
