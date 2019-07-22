import { IDiscordChannel, IDiscordHTTPResponse, IDiscordMessage } from '../../common/types';
import { IEndpointMessageDetailsObject } from '../../common/types/ChannelEndpoint.types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import Channel from './Channel';

export default class TextBasedChannel extends Channel {

  public Name: string;

  public Messages: MessageStore;

  public LastMessageId: string | undefined;
  public ApplicationId: string | undefined;
  public LastPinTimestamp: number | undefined;

  constructor(client: DiscordClient, ChannelObject: IDiscordChannel) {
    super(client, ChannelObject);
    this.Name = ChannelObject.name || "";

    this.Messages = new MessageStore(client);

    this.LastMessageId = ChannelObject.last_message_id ? ChannelObject.last_message_id : undefined;
    this.ApplicationId = ChannelObject.application_id ? ChannelObject.application_id : undefined;
    this.LastPinTimestamp = ChannelObject.last_pin_timestamp ? ChannelObject.last_pin_timestamp : undefined;
  }

  public SendMessage(Content: string, MessageDetails: IEndpointMessageDetailsObject): Promise<IDiscordMessage> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods().ChannelMethods().CreateMessage(this.id, Content, MessageDetails).then((Response: IDiscordHTTPResponse) => {
        resolve(Response.body)
      }).catch((err) => {
        reject(err);
      })
    })
  }
  
}