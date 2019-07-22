import { IDiscordGuild, IDiscordVoiceServerGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ChannelStore from '../../stores/ChannelStore';
import EmojiStore from '../../stores/EmojiStore';
import GuildMemberStore from '../../stores/GuildMemberStore';
import PresenceStore from '../../stores/PresenceStore';
import RoleStore from '../../stores/RoleStore';
import VoiceStateStore from '../../stores/VoiceStateStore';
import VoiceConnection from '../../voice/VoiceConnection';
import VoiceManager from '../../voice/VoiceManager';
import GuildActions from './Actions/GuildActions';
export default class Guild {
    id: string;
    Name: string;
    OwnerId: string;
    Region: string;
    AfkTimeout: number;
    VerificationLevel: number;
    DefaultMessageNotification: number;
    ExplicitContentFilter: number;
    Roles: RoleStore;
    Emojis: EmojiStore;
    Features: string[];
    MFALevel: number;
    PremiumTier: number;
    VoiceConnection?: VoiceConnection;
    PremiumSubscriptionCount: number;
    Banner?: string;
    Description?: string;
    VanityURLCode?: string;
    MaxPresences: number;
    MaxMembers?: number;
    Presences: PresenceStore;
    Channels: ChannelStore;
    Members: GuildMemberStore;
    VoiceStates: VoiceStateStore;
    MemberCount: number;
    Unavailable: boolean | undefined;
    Large: boolean | undefined;
    JoinedAt: number | undefined;
    SystemChannelId: string | undefined;
    WidgetChannelId: string | undefined;
    WidgetEnabled: boolean | undefined;
    ApplicationId: string | undefined;
    EmbedChannelId: string | undefined;
    EmbedEnabled: boolean | undefined;
    AfkChannelId: string | undefined;
    Permissions: number | undefined;
    Owner: boolean | undefined;
    Icon: string | undefined;
    Splash: string | undefined;
    private readonly Client;
    private _PendingVoiceConnection?;
    private _PendingVoiceServerDetails?;
    PendingVoiceConnection: boolean;
    PendingVoiceServerDetails: IDiscordVoiceServerGatewayEvent | undefined;
    constructor(client: DiscordClient, GuildObject: IDiscordGuild);
    /**
     * Creates a new voice connection for this guild
     * @param Token - token provided as part of the voice server update event payload
     * @param Endpoint - endpoint provided as part of the voice server update event payload
     */
    CreateVoiceConnection(Token: string, Endpoint: string): Promise<VoiceManager>;
    /**
     * Carry out actions on this guild (these will call Discords REST API)
     */
    Actions(): GuildActions;
    private ResolveVoiceStates;
    private ResolvePresences;
    private ResolveRoles;
    private ResolveEmojis;
    private ResolveMembersAndPresences;
    private ResolveChannels;
}
