import { IDiscordVoiceState } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceChannel from '../Channel/VoiceChannel';
import Guild from '../Guild/Guild';
import GuildMember from '../Guild/GuildMember';
export default class VoiceState {
    UserId: string;
    SessionId: string;
    Deaf: boolean;
    Mute: boolean;
    SelfDeaf: boolean;
    SelfMute: boolean;
    Suppress: boolean;
    GuildId?: string;
    Guild?: Guild;
    ChannelId?: string;
    VoiceChannel?: VoiceChannel;
    GuildMember?: GuildMember;
    /**
     * Create A VoiceState
     * WARN the guild parameter should only be set when loading from a GUILD_CREATE event
     * @param Client - The DiscordClient instance
     * @param VoiceStateObject - Discord Voice state object
     * @param guild - the guild instance
     * @constructor
     */
    constructor(Client: DiscordClient, VoiceStateObject: IDiscordVoiceState, guild?: Guild);
}
