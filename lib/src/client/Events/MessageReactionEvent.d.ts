import { IDiscordMessageReactionGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import ReactionEmoji from '../../resources/Message/ReactionEmoji';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class MessageReactionEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordMessageReactionGatewayEvent;
    EventName?: 'MESSAGE_REACTION_ADD' | 'MESSAGE_REACTION_REMOVE' | 'MESSAGE_REACTION_REMOVE_ALL';
    EventChannelObject?: TextChannel | DirectMessageChannel;
    EventMessageId?: string;
    EventEmojiObject?: ReactionEmoji;
    EventUserObject?: User;
    EventGuildObject?: Guild;
    constructor(client: DiscordClient, msg: IDiscordMessageReactionGatewayEvent);
    /**
     * Handles MESSAGE_REACTION_ADD event
     */
    HandleReactionAdd(): void;
    /**
     * Handles MESSAGE_REACTION_REMOVE event
     */
    HandleReactionRemove(): void;
    HandleReactionRemoveAll(): void;
    EmitEvent(): void;
    private UpdateMessage;
    private GetGuildAndChannel;
}
