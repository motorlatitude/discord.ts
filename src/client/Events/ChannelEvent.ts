import { IChannelDeleteEventObject, IDiscordChannel } from '../../common/types';

import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

import TextChannel from '../../resources/Channel/TextChannel';

import CHANNEL_TYPES from '../../common/constants/channeltypes';
import CategoryChannel from '../../resources/Channel/CategoryChannel';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import VoiceChannel from '../../resources/Channel/VoiceChannel';
import Guild from '../../resources/Guild/Guild';

export default class ChannelEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordChannel;

  private EventName: string = '';
  private EventObject: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel | undefined;
  private EventDeleteObject: IChannelDeleteEventObject | undefined;

  constructor(client: DiscordClient, data: IDiscordChannel) {
    super(client);

    this.Message = data;
  }

  /**
   * Handle CHANNEL_CREATE event
   */
  public HandleCreate(): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel> {
    return new Promise((resolve, reject) => {
      this.EventName = 'CHANNEL_CREATE';
      if(this.Message.guild_id){
        this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
          if (this.Message.type === CHANNEL_TYPES.GUILD_TEXT) {
            const NewTextChannel: TextChannel = new TextChannel(this.Client, this.Message, AffectedGuild);
            this.EventObject = NewTextChannel;
            AffectedGuild.Channels.AddTextChannel(NewTextChannel);
          } else if (this.Message.type === CHANNEL_TYPES.GUILD_VOICE) {
            const NewVoiceChannel: VoiceChannel = new VoiceChannel(this.Client, this.Message, AffectedGuild);
            this.EventObject = NewVoiceChannel;
            AffectedGuild.Channels.AddVoiceChannel(NewVoiceChannel);
          } else if (this.Message.type === CHANNEL_TYPES.GUILD_CATEGORY) {
            const NewChannelCategory: CategoryChannel = new CategoryChannel(this.Client, this.Message, AffectedGuild);
            this.EventObject = NewChannelCategory;
            AffectedGuild.Channels.AddChannelCategory(NewChannelCategory);
          }
          if(this.EventObject){
            this.Handle();
            resolve(this.EventObject);
          }
          else{
            reject(new Error("Unhandled Channel Type: "+this.Message.type))
          }
        }).catch((err: Error) => {
          reject(err);
        });
      }
      else{
        if (this.Message.type === CHANNEL_TYPES.DM || this.Message.type === CHANNEL_TYPES.GROUP_DM) {
          const NewDMChannel: DirectMessageChannel = new DirectMessageChannel(this.Client, this.Message);
          this.EventObject = NewDMChannel;
          this.Client.Channels.AddDMChannel(NewDMChannel);
          this.Handle();
          resolve(this.EventObject);
        }
        else{
          reject(new Error("Unhandled Channel Type: "+this.Message.type))
        }
      }
    });
  }

  /**
   * Handle CHANNEL_UPDATE event
   */
  public HandleUpdate(): Promise<TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel> {
    return new Promise((resolve, reject) => {
      this.EventName = 'CHANNEL_UPDATE';

      if (this.Message.guild_id) {
        this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
          let NewChannel;
          if (this.Message.type === CHANNEL_TYPES.GUILD_TEXT) {
            NewChannel = new TextChannel(this.Client, this.Message, AffectedGuild);
          } else if (this.Message.type === CHANNEL_TYPES.GUILD_VOICE) {
            NewChannel = new VoiceChannel(this.Client, this.Message, AffectedGuild);
          } else if (this.Message.type === CHANNEL_TYPES.GUILD_CATEGORY) {
            NewChannel = new CategoryChannel(this.Client, this.Message, AffectedGuild);
          }
          if (NewChannel) {
            this.EventObject = NewChannel;
            AffectedGuild.Channels.ReplaceChannel(this.Message.id, NewChannel);
            this.Handle();
            resolve(this.EventObject);
          }
        });
      } else if (this.Message.type === CHANNEL_TYPES.DM || this.Message.type === CHANNEL_TYPES.GROUP_DM) {
        const NewChannel = new DirectMessageChannel(this.Client, this.Message);
        this.EventObject = NewChannel;
        this.Client.Channels.ReplaceChannel(this.Message.id, NewChannel);
        this.Handle();
        resolve(this.EventObject);
      }
      else{
        reject(new Error("Unhandled Guild Channel Combination"))
      }
    });
  }

  /**
   * Handle CHANNEL_DELETE
   */
  public HandleDelete(): Promise<IChannelDeleteEventObject> {
    return new Promise((resolve) => {
      this.EventName = 'CHANNEL_DELETE';
      this.EventDeleteObject = {
        Id: this.Message.id,
        Type: this.Message.type,
      };

      this.Client.Channels.RemoveChannel(this.Message.id);
      this.Handle();
      resolve(this.EventDeleteObject);
    })
  }

  /**
   * Handle Emitting To Client
   * @override
   */
  public EmitEvent(): void {
    if ((this.EventName === 'CHANNEL_UPDATE' || this.EventName === 'CHANNEL_CREATE') && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    } else if (this.EventName === 'CHANNEL_DELETE' && this.EventDeleteObject) {
      this.Client.emit(this.EventName, this.EventDeleteObject);
    }
  }
}
