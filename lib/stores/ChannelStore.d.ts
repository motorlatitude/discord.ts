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
    constructor(client: DiscordClient);
    /**
     * Add a Text Channel to the Channel Store
     * @param TextChannelToBeStored - A TextChannel
     */
    AddTextChannel(TextChannelToBeStored: TextChannel): void;
    /**
     * Add a Voice Channel to the Channel Store
     * @param VoiceChannelToBeStored - A VoiceChannel
     */
    AddVoiceChannel(VoiceChannelToBeStored: VoiceChannel): void;
    /**
     * Add a Direct Message Channel to the Channel Store
     * @param DMChannelToBeStored - A DirectMessageChannel
     */
    AddDMChannel(DMChannelToBeStored: DirectMessageChannel): void;
    /**
     * Add a Channel Category to the Channel Store
     * @param ChannelCategory - A CategoryChannel
     */
    AddChannelCategory(ChannelCategory: CategoryChannel): void;
    /**
     * Replace an existing Text Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A TextChannel
     */
    ReplaceTextChannel(ChannelId: string, Channel: TextChannel): void;
    /**
     * Replace an existing Voice Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A VoiceChannel
     */
    ReplaceVoiceChannel(ChannelId: string, Channel: VoiceChannel): void;
    /**
     * Replace an existing Voice Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A VoiceChannel
     */
    ReplaceDirectMessageChannel(ChannelId: string, Channel: DirectMessageChannel): void;
    /**
     * Replace an existing Category Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A CategoryChannel
     */
    ReplaceChannelCategory(ChannelId: string, Channel: CategoryChannel): void;
    ReplaceChannel(ChannelId: string, Channel: IChannel): void;
    RemoveChannel(ChannelId: string): void;
    /**
     * Fetch a Text Channel
     * @param ChannelId - channel id of the text channel
     */
    FetchTextChannel(ChannelId: string): Promise<TextChannel>;
    /**
     * Fetch a Direct Message Channel
     * @param ChannelId - channel id of the direct message channel
     */
    FetchDirectMessageChannel(ChannelId: string): Promise<DirectMessageChannel>;
    /**
     * Fetch a TextChannel, VoiceChannel, DirectMessageChannel or CategoryChannel with an id
     * @param ChannelId - channel id
     */
    FetchAllTypes(ChannelId: string): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel>;
}
