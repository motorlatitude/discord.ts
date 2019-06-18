import DiscordClient from '../DiscordClient';
import CategoryChannel from '../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../resources/Channel/DirectMessageChannel';
import TextChannel from '../resources/Channel/TextChannel';
import VoiceChannel from '../resources/Channel/VoiceChannel';
import Store from './Store';

export default class ChannelStore extends Store {

  /**
   * Constructor
   * @param client
   * @constructor
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add a Text Channel to the Channel Store
   * @param TextChannelToBeStored - A TextChannel
   */
  public AddTextChannel(TextChannelToBeStored: TextChannel) {
    this.Add(TextChannelToBeStored.id, TextChannelToBeStored).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddTextChannel.Store',
      });
    });
  }

  /**
   * Add a Voice Channel to the Channel Store
   * @param VoiceChannelToBeStored - A VoiceChannel
   */
  public AddVoiceChannel(VoiceChannelToBeStored: VoiceChannel) {
    this.Add(VoiceChannelToBeStored.id, VoiceChannelToBeStored).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddVoiceChannel.Store',
      });
    });
  }

  /**
   * Add a Direct Message Channel to the Channel Store
   * @param DMChannelToBeStored - A DirectMessageChannel
   */
  public AddDMChannel(DMChannelToBeStored: DirectMessageChannel) {
    this.Add(DMChannelToBeStored.id, DMChannelToBeStored).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddDMChannel.Store',
      });
    });
  }

  /**
   * Add a Channel Category to the Channel Store
   * @param ChannelCategory - A CategoryChannel
   */
  public AddChannelCategory(ChannelCategory: CategoryChannel) {
    this.Add(ChannelCategory.id, ChannelCategory).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddChannelCategory.Store',
      });
    });
  }

  /**
   * Fetch a channel with an id
   * @param ChannelId - channel id
   */
  public Fetch(ChannelId: string): TextChannel {
    return super.Get(ChannelId);
  }
}
