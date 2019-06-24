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

  /**
   * Create A VoiceState
   * WARN the guild parameter should only be set when loading from a GUILD_CREATE event
   * @param Client - The DiscordClient instance
   * @param VoiceStateObject - Discord Voice state object
   * @param guild - the guild instance
   * @constructor
   */
  constructor(Client: DiscordClient, VoiceStateObject: IDiscordVoiceState, guild?: Guild) {
    this.UserId = VoiceStateObject.user_id;
    this.SessionId = VoiceStateObject.session_id;
    this.Deaf = VoiceStateObject.deaf;
    this.Mute = VoiceStateObject.mute;
    this.SelfDeaf = VoiceStateObject.self_deaf;
    this.SelfMute = VoiceStateObject.self_mute;
    this.Suppress = VoiceStateObject.suppress;

    this.ChannelId = VoiceStateObject.channel_id;
    if(guild){
      this.GuildId = guild.id;
      this.Guild = guild;
      this.GuildMember = this.Guild.Members.Get(this.UserId);
      if (this.ChannelId) {
        this.Guild.Channels.FetchVoiceChannel(this.ChannelId).then((AffectedChannel: VoiceChannel) => {
          this.VoiceChannel = AffectedChannel;
        }).catch((err: Error) => {
          Client.logger.write().error({
            message: err,
            service: "Guild.VoiceState"
          })
        })
      } else {
        // Left A Guild Voice Channel
      }
    }
    else{
      this.GuildId = VoiceStateObject.guild_id;
      if (this.GuildId) {
        Client.Guilds.Fetch(this.GuildId).then((AffectedGuild: Guild) => {
          this.Guild = AffectedGuild;
          this.GuildMember = this.Guild.Members.Get(this.UserId);
          if (this.ChannelId) {
            this.Guild.Channels.FetchVoiceChannel(this.ChannelId).then((AffectedChannel: VoiceChannel) => {
              this.VoiceChannel = AffectedChannel;
            }).catch((err: Error) => {
              Client.logger.write().error({
                message: err,
                service: "Guild.VoiceState"
              })
            });
          } else {
            // Left A Guild Voice Channel
          }
        });
      } else if (this.ChannelId) {
        Client.Channels.FetchVoiceChannel(this.ChannelId).then((AffectChannel: VoiceChannel) => {
          this.VoiceChannel = AffectChannel;
        }).catch((err: Error) => {
          Client.logger.write().error({
            message: err,
            service: "Guild.VoiceState"
          })
        });
      } else {
        // Left A Private Voice Channel
      }
    }
  }
}
