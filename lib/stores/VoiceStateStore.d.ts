import DiscordClient from '../DiscordClient';
import VoiceState from '../resources/Voice/VoiceState';
import Store from './Store';
export default class VoiceStateStore extends Store {
    constructor(client: DiscordClient);
    AddVoiceState(VoiceStateObject: VoiceState): void;
    UpdateVoiceState(UserId: string, VoiceStateObject: VoiceState): void;
    RemoveVoiceState(UserId: string): void;
}
