import { IDiscordVoiceServerGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import VoiceManager from '../../voice/VoiceManager';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class VoiceServerUpdateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordVoiceServerGatewayEvent;

  public EventName: 'VOICE_SERVER_UPDATE' = 'VOICE_SERVER_UPDATE';
  public EventObject?: VoiceManager;

  constructor(client: DiscordClient, msg: IDiscordVoiceServerGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles VOICE_SERVER_UPDATE
   * This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.
   */
  public Handle(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      this.Client.logger.write().info({
        message:
          'A Server Update Event Occurred with these details; token: ' +
          this.Message.token +
          ', endpoint: ' +
          this.Message.endpoint,
        service: 'ClientDispatcher.Events.VoiceServerUpdate.Handle',
      });
      AffectedGuild.CreateVoiceConnection(this.Message.token, this.Message.endpoint)
        .then((NewVoiceManager: VoiceManager) => {
          this.EventObject = NewVoiceManager;

          super.Handle();
        })
        .catch((err: Error) => {
          this.Client.logger.write().warn({
            message: err,
            service: 'ClientDispatcher.Events.VoiceServerUpdate.Handle',
          });
          // Failed to establish new voice connection, either we don't have a user or session_id has not be received yet
          AffectedGuild.PendingVoiceConnection = true;
          AffectedGuild.PendingVoiceServerDetails = this.Message;
          // Wait for voice state update for 5 seconds and then delete data
          setTimeout(() => {
            AffectedGuild.PendingVoiceConnection = false;
            delete AffectedGuild.PendingVoiceServerDetails;
          }, 5000);
        });
    });
  }

  /**
   * Handles delayed VOICE_STATE_UPDATE
   */
  public HandlePendingVoiceConnection(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      this.Client.logger.write().info({
        message:
          'A Delayed Server Update Event Occurred with these details; token: ' +
          this.Message.token +
          ', endpoint: ' +
          this.Message.endpoint,
        service: 'ClientDispatcher.Events.VoiceServerUpdate.HandlePendingVoiceConnection',
      });
      AffectedGuild.CreateVoiceConnection(this.Message.token, this.Message.endpoint)
        .then((NewVoiceManager: VoiceManager) => {
          this.EventObject = NewVoiceManager;

          super.Handle();
        })
        .catch((err: Error) => {
          // Complete failure
          this.Client.logger.write().error({
            message: err,
            service: 'ClientDispatcher.Events.VoiceServerUpdate.HandlePendingVoiceConnection',
          });
        });
    });
  }

  public EmitEvent(): void {
    if (this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }
}
