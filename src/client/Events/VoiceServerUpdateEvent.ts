import { IDiscordVoiceServerGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class VoiceServerUpdateEvent extends ClientDispatcherEvent {

  constructor(client: DiscordClient, msg: IDiscordVoiceServerGatewayEvent) {
    super(client);
  }

  /**
   * Handles VOICE_SERVER_UPDATE
   * This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.
   */
  public Handle(): void {
    // Complex code here
  }

}