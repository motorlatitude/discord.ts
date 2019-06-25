import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceManager from '../../voice/VoiceManager';
import Guild from '../Guild/Guild';
import Channel from './Channel';

export default class VoiceChannel extends Channel {
  public Guild?: Guild;

  public GuildId?: string;
  public Position: number;
  public PermissionOverwrites: any[];
  public Name: string;
  public Bitrate: number;
  public UserLimit: number;

  public VoiceManager?: VoiceManager;

  constructor(Client: DiscordClient, ChannelObject: IDiscordChannel, guild?: Guild) {
    super(Client, ChannelObject);

    if (guild) {
      this.Guild = guild;
      this.GuildId = guild.id;
    }
    this.Position = ChannelObject.position as number;
    this.PermissionOverwrites = ChannelObject.permission_overwrites as any[];
    this.Name = ChannelObject.name as string;
    this.Bitrate = ChannelObject.bitrate as number;
    this.UserLimit = ChannelObject.user_limit as number;
  }

  /**
   * Join this voice channel
   */
  public Join(): Promise<VoiceManager> {
    return new Promise((resolve, reject) => {
      if (this.Client.Connection && this.GuildId) {
        this.Client.on('VOICE_SERVER_UPDATE', (NewVoiceManager: VoiceManager) => {
          this.VoiceManager = NewVoiceManager;
          resolve(NewVoiceManager);
        });
        this.Client.Connection.JoinVoiceChannel(this.GuildId, this.id);
      } else {
        reject(new Error('This Channel is either not part of a guild or there is no active client connection'));
      }
    });
  }

  /**
   * Leave this voice channel
   */
  public Leave(): void {
    if (this.VoiceManager instanceof VoiceManager && this.Client.Connection && this.GuildId) {
      this.Client.Connection.LeaveVoiceChannel(this.GuildId);
      this.VoiceManager.VoiceConnection.Disconnect();
      delete this.VoiceManager;
    }
  }
}
