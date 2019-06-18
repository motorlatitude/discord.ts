import { IDiscordChannel } from '../../common/types';

import EVENTS from '../../common/constants/events';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

import TextChannel from '../../resources/Channel/TextChannel';

import CHANNELTYPES from '../../common/constants/channeltypes';
import CategoryChannel from '../../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import VoiceChannel from '../../resources/Channel/VoiceChannel';

export default class ChannelEvents extends ClientDispatcherEvent {
  public DiscordChannel: IDiscordChannel;

  constructor(client: DiscordClient, data: IDiscordChannel) {
    super(client);

    this.DiscordChannel = data;
  }

  /**
   * Handle CHANNEL_CREATE event
   * @constructor
   */
  public HandleCreate(): void {
    this.EventName = EVENTS.CHANNEL_CREATE;

    if (this.DiscordChannel.type === CHANNELTYPES.GUILD_TEXT) {
      const NewTextChannel: TextChannel = new TextChannel(this.DiscordChannel);

      this.EventObject = NewTextChannel;

      this.client.Channels.AddTextChannel(NewTextChannel);
    } else if (this.DiscordChannel.type === CHANNELTYPES.GUILD_VOICE) {
      const NewVoiceChannel: VoiceChannel = new VoiceChannel(this.DiscordChannel);

      this.EventObject = NewVoiceChannel;

      this.client.Channels.AddVoiceChannel(NewVoiceChannel);
    } else if (this.DiscordChannel.type === CHANNELTYPES.DM || this.DiscordChannel.type === CHANNELTYPES.GROUP_DM) {
      const NewDMChannel: DirectMessageChannel = new DirectMessageChannel(this.DiscordChannel);

      this.EventObject = NewDMChannel;

      this.client.Channels.AddDMChannel(NewDMChannel);
    } else if (this.DiscordChannel.type === CHANNELTYPES.GUILD_CATEGORY) {
      const NewChannelCategory: CategoryChannel = new CategoryChannel(this.DiscordChannel);

      this.EventObject = NewChannelCategory;

      this.client.Channels.AddChannelCategory(NewChannelCategory);
    }

    this.Handle();
  }
}
