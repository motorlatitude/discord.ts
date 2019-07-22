import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceManager from '../../voice/VoiceManager';
import Guild from '../Guild/Guild';
import Channel from './Channel';
export default class VoiceChannel extends Channel {
    Guild?: Guild;
    GuildId?: string;
    Position: number;
    PermissionOverwrites: any[];
    Name: string;
    Bitrate: number;
    UserLimit: number;
    VoiceManager?: VoiceManager;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild?: Guild);
    /**
     * Join this voice channel
     */
    Join(): Promise<VoiceManager>;
    /**
     * Leave this voice channel
     */
    Leave(): void;
}
