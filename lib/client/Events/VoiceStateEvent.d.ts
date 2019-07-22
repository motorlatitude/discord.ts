import { IDiscordVoiceState } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import VoiceState from '../../resources/Voice/VoiceState';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class VoiceStateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordVoiceState;
    readonly EventName: 'VOICE_STATE_UPDATE';
    EventType?: 'JOINED' | 'UPDATED' | 'LEFT';
    EventObject?: VoiceState;
    constructor(client: DiscordClient, msg: IDiscordVoiceState);
    /**
     * Handles VOICE_STATE_UPDATE
     * Sent when someone joins/leaves/moves voice channels.
     */
    Handle(): void;
    EmitEvent(): void;
}
