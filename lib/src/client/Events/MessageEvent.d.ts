import { IDiscordMessage, IDiscordMessageDeleteGatewayEvent, IDiscordMessageUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import Message from '../../resources/Message/Message';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class MessageEvent extends ClientDispatcherEvent {
    EventName?: 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE' | 'MESSAGE_DELETE_BULK';
    EventMessageObject?: Message;
    EventAuthorObject?: User;
    EventChannelObject?: TextChannel | DirectMessageChannel;
    EventGuildObject?: Guild;
    EventMemberObject?: GuildMember;
    EventBulkMessageObject?: Message[];
    constructor(client: DiscordClient);
    /**
     * Handles MESSAGE_CREATE event
     * @param msg - the created message
     */
    HandleMessageCreate(msg: IDiscordMessage): void;
    /**
     * Handles MESSAGE_UPDATE event
     * @param msg - partial message object, must contain id and channel_id and will contain guild_id if message is part of a guild
     */
    HandleMessageUpdate(msg: IDiscordMessageUpdateGatewayEvent): void;
    /**
     * Handles MESSAGE_DELETE and MESSAGE_DELETE_BULK events
     * @param msg - message ids, channel id and guild_id
     */
    HandleMessageDelete(msg: IDiscordMessageDeleteGatewayEvent): void;
    EmitEvent(): void;
}
