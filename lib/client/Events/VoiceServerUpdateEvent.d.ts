import { IDiscordVoiceServerGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceManager from '../../voice/VoiceManager';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class VoiceServerUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordVoiceServerGatewayEvent;
    EventName: 'VOICE_SERVER_UPDATE';
    EventObject?: VoiceManager;
    constructor(client: DiscordClient, msg: IDiscordVoiceServerGatewayEvent);
    /**
     * Handles VOICE_SERVER_UPDATE
     * This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.
     */
    Handle(): void;
    /**
     * Handles delayed VOICE_STATE_UPDATE
     */
    HandlePendingVoiceConnection(): void;
    EmitEvent(): void;
}
