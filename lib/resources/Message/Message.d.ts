import { IDiscordMessage } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ReactionStore from '../../stores/ReactionStore';
import DirectMessageChannel from '../Channel/DirectMessageChannel';
import TextChannel from '../Channel/TextChannel';
import Guild from '../Guild/Guild';
import GuildMember from '../Guild/GuildMember';
import User from '../User/User';
export default class Message {
    id: string;
    ChannelId: string;
    Author: User;
    Content: string;
    Timestamp: number;
    TTS: boolean;
    MentionEveryone: boolean;
    Mentions: User[];
    MentionRoles: string[];
    Attachments: any[];
    Embeds: any[];
    Pinned: boolean;
    Type: number;
    GuildId?: string;
    Member?: GuildMember;
    Channel?: TextChannel | DirectMessageChannel;
    EditedTimestamp?: number;
    Reactions: ReactionStore;
    Nonce?: string;
    WebhookId?: string;
    Activity?: any;
    Application?: any;
    constructor(client: DiscordClient, MessageObject: IDiscordMessage);
    /**
     * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
     * Sets this message as a Direct Message
     * @param Channel - Direct Message Channel that this message is part of
     */
    SetDirectMessage(Channel: DirectMessageChannel): void;
    /**
     * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
     * Sets this message as a Text message in a guild
     * @param GuildId - Guild Id of the guild that the message is part of
     * @param MessageGuild - the guild that the message is part of
     * @param Member - guild member of the author
     * @param Channel - the text channel that the message is part of
     */
    SetGuildMessage(GuildId: string, MessageGuild: Guild, Member: GuildMember, Channel: TextChannel): void;
    /**
     * Resolve Message class to IDiscordMessage
     */
    Resolve(): IDiscordMessage;
    /**
     * Resolves IDiscordReaction[] to Reaction[] and insert into ReactionStore
     * @param ReactionObjects - array of IDiscordReactions
     */
    private ResolveReactions;
}
