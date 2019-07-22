import { IDiscordGuildMemberAddGatewayEvent, IDiscordGuildMemberRemoveGatewayEvent, IDiscordGuildMembersChunkGatewayEvent, IDiscordGuildMemberUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildMemberEvent extends ClientDispatcherEvent {
    EventName?: 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_UPDATE' | 'GUILD_MEMBER_REMOVE' | 'GUILD_MEMBERS_CHUNK';
    EventGuildObject?: Guild;
    EventGuildMemberObject?: GuildMember;
    EventGuildMemberChunkObject?: GuildMember[];
    /**
     * Constructor
     * @param client - Discord Client
     */
    constructor(client: DiscordClient);
    /**
     * Handles GUILD_MEMBER_ADD event
     * @param Message - Message Data for the event
     */
    HandleMemberAdd(Message: IDiscordGuildMemberAddGatewayEvent): void;
    /**
     * Handles GUILD_MEMBER_REMOVE event
     * @param Message - Message Data for the event
     */
    HandleMemberRemove(Message: IDiscordGuildMemberRemoveGatewayEvent): void;
    /**
     * Handles GUILD_MEMBER_UPDATE event
     * @param Message - Message Data for the event
     */
    HandleMemberUpdate(Message: IDiscordGuildMemberUpdateGatewayEvent): void;
    /**
     * Handles GUILD_MEMBERS_CHUNK
     * Sent in response to Guild Request Members.
     * @param Message - Message Data for the event
     */
    HandleMemberChunk(Message: IDiscordGuildMembersChunkGatewayEvent): void;
    EmitEvent(): void;
}
