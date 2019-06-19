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
  public HandleCreate(): void {
    this.EventName = 'CHANNEL_CREATE';

    if (this.Message.type === CHANNEL_TYPES.GUILD_TEXT && this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
        const NewTextChannel: TextChannel = new TextChannel(this.Message);

        this.EventObject = NewTextChannel;

        AffectedGuild.Channels.AddTextChannel(NewTextChannel);
        this.Handle();
      });
    } else if (this.Message.type === CHANNEL_TYPES.GUILD_VOICE && this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
        const NewVoiceChannel: VoiceChannel = new VoiceChannel(this.Message);

        this.EventObject = NewVoiceChannel;

        AffectedGuild.Channels.AddVoiceChannel(NewVoiceChannel);
        this.Handle();
      });
    } else if (this.Message.type === CHANNEL_TYPES.DM || this.Message.type === CHANNEL_TYPES.GROUP_DM) {
      const NewDMChannel: DirectMessageChannel = new DirectMessageChannel(this.Message);

      this.EventObject = NewDMChannel;

      this.Client.Channels.AddDMChannel(NewDMChannel);
      this.Handle();
    } else if (this.Message.type === CHANNEL_TYPES.GUILD_CATEGORY && this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
        const NewChannelCategory: CategoryChannel = new CategoryChannel(this.Message);

        this.EventObject = NewChannelCategory;

        AffectedGuild.Channels.AddChannelCategory(NewChannelCategory);
        this.Handle();
      });
    } else {
      this.Client.logger.write().warn({
        message: 'Unhandled Channel Type: ' + this.Message.type,
        service: 'ClientDispatcher.Events.ChannelEvent.HandleCreate',
      });
    }
  }

  /**
   * Handle CHANNEL_UPDATE event
   */
  public HandleUpdate(): void {
    this.EventName = 'CHANNEL_UPDATE';

    let NewChannel: TextChannel | VoiceChannel | DirectMessageChannel | CategoryChannel | undefined;
    if (this.Message.type === CHANNEL_TYPES.GUILD_TEXT) {
      NewChannel = new TextChannel(this.Message);
    } else if (this.Message.type === CHANNEL_TYPES.GUILD_VOICE) {
      NewChannel = new VoiceChannel(this.Message);
    } else if (this.Message.type === CHANNEL_TYPES.DM || this.Message.type === CHANNEL_TYPES.GROUP_DM) {
      NewChannel = new DirectMessageChannel(this.Message);
    } else if (this.Message.type === CHANNEL_TYPES.GUILD_CATEGORY) {
      NewChannel = new CategoryChannel(this.Message);
    }
    if (NewChannel) {
      this.EventObject = NewChannel;
      if (this.Message.guild_id) {
        this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
          if (NewChannel) {
            AffectedGuild.Channels.ReplaceChannel(this.Message.id, NewChannel);
            this.Handle();
          }
        });
      } else if (this.Message.type === CHANNEL_TYPES.DM || this.Message.type === CHANNEL_TYPES.GROUP_DM) {
        this.Client.Channels.ReplaceChannel(this.Message.id, NewChannel);
        this.Handle();
      }
    } else {
      this.Client.logger.write().warn({
        message: 'Unhandled Channel Type: ' + this.Message.type,
        service: 'ClientDispatcher.Events.ChannelEvent.HandleUpdate',
      });
    }
  }

  /**
   * Handle CHANNEL_DELETE
   */
  public HandleDelete(): void {
    this.EventName = 'CHANNEL_DELETE';
    this.EventDeleteObject = {
      Id: this.Message.id,
      Type: this.Message.type,
    };

    this.Client.Channels.RemoveChannel(this.Message.id);
    this.Handle();
  }

  /**
   * Handle Emitting To Client
   * @override
   */
  public EmitEvent(): void {
    if (this.EventName === 'CHANNEL_UPDATE' || this.EventName === 'CHANNEL_CREATE') {
      if (this.EventObject) {
        this.Client.emit(this.EventName, this.EventObject);
      }
    } else if (this.EventName === 'CHANNEL_DELETE' && this.EventDeleteObject) {
      this.Client.emit(this.EventName, this.EventDeleteObject);
    }
  }
}
