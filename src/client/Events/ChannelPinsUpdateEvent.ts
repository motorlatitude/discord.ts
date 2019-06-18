import { IChannelPinsUpdateEventObject, IDiscordChannelPinsUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import CategoryChannel from '../../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import VoiceChannel from '../../resources/Channel/VoiceChannel';
import ClientDispatcherEvent from './ClientDispatcherEvent';


export default class ChannelPinsUpdateEvent extends ClientDispatcherEvent {

  public readonly Message: IDiscordChannelPinsUpdateGatewayEvent;

  public readonly EventName: string = "CHANNEL_PINS_UPDATE";
  public EventObject: IChannelPinsUpdateEventObject | undefined;

  constructor(client: DiscordClient, message: IDiscordChannelPinsUpdateGatewayEvent) {
    super(client);

    this.Message = message;
  }

  public Handle(): void {

    this.Client.Channels.FetchAllTypes(this.Message.channel_id).then((Channel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel) => {
      if(Channel instanceof TextChannel){
        this.EventObject = {
          Channel,
          ChannelId: this.Message.channel_id,
          LastPinTimestamp: this.Message.last_pin_timestamp
        }
        if(this.Message.guild_id){
          this.EventObject.GuildId = this.Message.guild_id;

        }
        super.Handle();
      }
      else{
        this.Client.logger.write().error({
          message: new Error("A Channel of the wrong type was returned for the supplied channel id"),
          service: "ClientDispatcher.Events.ChannelPinsUpdateEvent.Handle"
        })
      }
    })
  }

  public EmitEvent(): void {

  }

}