import { IDiscordPresenceUpdate } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Presence from '../../resources/User/Presence';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class PresenceUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordPresenceUpdate;
    readonly EventName: 'PRESENCE_UPDATE';
    EventNewPresence?: Presence;
    EventOldPresence?: Presence;
    constructor(client: DiscordClient, msg: IDiscordPresenceUpdate);
    Handle(): void;
    EmitEvent(): void;
}
