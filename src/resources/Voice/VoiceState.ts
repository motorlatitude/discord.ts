import { IDiscordVoiceState } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceChannel from '../Channel/VoiceChannel';
import Guild from '../Guild/Guild';
import GuildMember from '../Guild/GuildMember';

export default class VoiceState {
  public UserId: string;
  public SessionId: string;
  public Deaf: boolean;
  public Mute: boolean;
  public SelfDeaf: boolean;
  public SelfMute: boolean;
  public Suppress: boolean;

  public GuildId?: string;
  public Guild?: Guild;
  public ChannelId?: string;
  public VoiceChannel?: VoiceChannel;
  public GuildMember?: GuildMember;

  constructor(Client: DiscordClient, VoiceStateObject: IDiscordVoiceState) {
    this.UserId = VoiceStateObject.user_id;
    this.SessionId = VoiceStateObject.session_id;
    this.Deaf = VoiceStateObject.deaf;
    this.Mute = VoiceStateObject.mute;
    this.SelfDeaf = VoiceStateObject.self_deaf;
    this.SelfMute = VoiceStateObject.self_mute;
    this.Suppress = VoiceStateObject.suppress;

    this.ChannelId = VoiceStateObject.channel_id;
    this.GuildId = VoiceStateObject.guild_id;
    if (this.GuildId) {
      Client.Guilds.Fetch(this.GuildId).then((AffectedGuild: Guild) => {
        this.Guild = AffectedGuild;
        this.GuildMember = this.Guild.Members.Get(this.UserId);
        if (this.ChannelId) {
          this.Guild.Channels.FetchVoiceChannel(this.ChannelId).then((AffectedChannel: VoiceChannel) => {
            this.VoiceChannel = AffectedChannel;
          });
        } else {
          // Left A Guild Voice Channel
        }
      });
    } else if (this.ChannelId) {
      Client.Channels.FetchVoiceChannel(this.ChannelId).then((AffectChannel: VoiceChannel) => {
        this.VoiceChannel = AffectChannel;
      });
    } else {
      // Left A Private Voice Channel
    }
  }
}
