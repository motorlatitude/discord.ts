import { IChannel } from '../common/types';
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
  public AddTextChannel(TextChannelToBeStored: TextChannel): void {
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
  public AddVoiceChannel(VoiceChannelToBeStored: VoiceChannel): void {
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
  public AddDMChannel(DMChannelToBeStored: DirectMessageChannel): void {
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
  public AddChannelCategory(ChannelCategory: CategoryChannel): void {
    this.Add(ChannelCategory.id, ChannelCategory).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddChannelCategory.Store',
      });
    });
  }

  /**
   * Replace an existing Text Channel in the Channel Store
   * @param ChannelId - The id of the channel
   * @param Channel - A TextChannel
   */
  public ReplaceTextChannel(ChannelId: string, Channel: TextChannel): void {
    this.Replace(ChannelId, Channel).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.ReplaceTextChannel.Store',
      });
    });
  }

  /**
   * Replace an existing Voice Channel in the Channel Store
   * @param ChannelId - The id of the channel
   * @param Channel - A VoiceChannel
   */
  public ReplaceVoiceChannel(ChannelId: string, Channel: VoiceChannel): void {
    this.Replace(ChannelId, Channel).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.ReplaceVoiceChannel.Store',
      });
    });
  }

  /**
   * Replace an existing Voice Channel in the Channel Store
   * @param ChannelId - The id of the channel
   * @param Channel - A VoiceChannel
   */
  public ReplaceDirectMessageChannel(ChannelId: string, Channel: DirectMessageChannel): void {
    this.Replace(ChannelId, Channel).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.ReplaceDirectMessageChannel.Store',
      });
    });
  }

  /**
   * Replace an existing Category Channel in the Channel Store
   * @param ChannelId - The id of the channel
   * @param Channel - A CategoryChannel
   */
  public ReplaceChannelCategory(ChannelId: string, Channel: CategoryChannel): void {
    this.Replace(ChannelId, Channel).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.ReplaceChannelCategory.Store',
      });
    });
  }

  public ReplaceChannel(
    ChannelId: string,
    Channel: IChannel,
  ): void {
    if (Channel instanceof TextChannel) {
      this.ReplaceTextChannel(ChannelId, Channel);
    } else if (Channel instanceof VoiceChannel) {
      this.ReplaceVoiceChannel(ChannelId, Channel);
    } else if (Channel instanceof DirectMessageChannel) {
      this.ReplaceDirectMessageChannel(ChannelId, Channel);
    } else {
      this.ReplaceChannelCategory(ChannelId, Channel);
    }
  }

  public RemoveChannel(ChannelId: string): void {
    this.Delete(ChannelId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.RemoveChannel.Store',
      });
    });
  }

  /**
   * Fetch a TextChannel, VoiceChannel, DirectMessageChannel or CategoryChannel with an id
   * @param ChannelId - channel id
   */
  public FetchAllTypes(
    ChannelId: string,
  ): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel> {
    return new Promise(resolve => {
      resolve(this.Get(ChannelId));
    });
  }
}
