import { IDiscordVoiceState } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import VoiceState from '../../resources/Voice/VoiceState';
import ClientDispatcherEvent from './ClientDispatcherEvent';
import VoiceServerUpdateEvent from './VoiceServerUpdateEvent';

export default class VoiceStateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordVoiceState;

  public readonly EventName: 'VOICE_STATE_UPDATE' = 'VOICE_STATE_UPDATE';
  public EventType?: 'JOINED' | 'UPDATED' | 'LEFT';
  public EventObject?: VoiceState;

  constructor(client: DiscordClient, msg: IDiscordVoiceState) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles VOICE_STATE_UPDATE
   * Sent when someone joins/leaves/moves voice channels.
   */
  public Handle(): void {
    if (this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
        if (this.Message.channel_id) {
          // Either user is joining or they're updating their state
          const OldVoiceState = AffectedGuild.VoiceStates.Get(this.Message.user_id);
          const NewVoiceState = new VoiceState(this.Client, this.Message);
          AffectedGuild.VoiceStates.UpdateVoiceState(this.Message.user_id, NewVoiceState);
          if (OldVoiceState) {
            this.EventType = 'UPDATED';
          } else {
            this.EventType = 'JOINED';
          }

          if (AffectedGuild.PendingVoiceConnection && AffectedGuild.PendingVoiceServerDetails) {
            const voiceServerUpdateEvent = new VoiceServerUpdateEvent(
              this.Client,
              AffectedGuild.PendingVoiceServerDetails,
            );
            voiceServerUpdateEvent.HandlePendingVoiceConnection();
          }

          this.EventObject = NewVoiceState;

          super.Handle();
        } else {
          // User has left the channel
          const OldVoiceState: VoiceState = AffectedGuild.VoiceStates.Get(this.Message.user_id);
          AffectedGuild.VoiceStates.RemoveVoiceState(this.Message.user_id);

          this.EventType = 'LEFT';
          this.EventObject = OldVoiceState;

          super.Handle();
        }
      });
    } else {
      // DM
      if (this.Message.channel_id) {
        // Either user is joining or they're updating their state
        const OldVoiceState = this.Client.VoiceStates.Get(this.Message.user_id);
        const NewVoiceState = new VoiceState(this.Client, this.Message);
        this.Client.VoiceStates.UpdateVoiceState(this.Message.user_id, NewVoiceState);
        if (OldVoiceState) {
          this.EventType = 'UPDATED';
        } else {
          this.EventType = 'JOINED';
        }
        this.EventObject = NewVoiceState;

        super.Handle();
      } else {
        // User has left the channel
        const OldVoiceState: VoiceState = this.Client.VoiceStates.Get(this.Message.user_id);
        this.Client.VoiceStates.RemoveVoiceState(this.Message.user_id);

        this.EventType = 'LEFT';
        this.EventObject = OldVoiceState;

        super.Handle();
      }
    }
  }

  public EmitEvent(): void {
    if (this.EventType && this.EventObject) {
      this.Client.emit(this.EventName, this.EventType, this.EventObject);
    }
  }
}
