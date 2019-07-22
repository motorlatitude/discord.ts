import { IChannelDeleteEventObject, IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
import TextChannel from '../../resources/Channel/TextChannel';
import CategoryChannel from '../../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import VoiceChannel from '../../resources/Channel/VoiceChannel';
export default class ChannelEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordChannel;
    private EventName;
    private EventObject;
    private EventDeleteObject;
    constructor(client: DiscordClient, data: IDiscordChannel);
    /**
     * Handle CHANNEL_CREATE event
     */
    HandleCreate(): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel>;
    /**
     * Handle CHANNEL_UPDATE event
     */
    HandleUpdate(): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel>;
    /**
     * Handle CHANNEL_DELETE
     */
    HandleDelete(): Promise<IChannelDeleteEventObject>;
    /**
     * Handle Emitting To Client
     * @override
     */
    EmitEvent(): void;
}
