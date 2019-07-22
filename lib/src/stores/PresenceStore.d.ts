import DiscordClient from '../DiscordClient';
import Presence from '../resources/User/Presence';
import Store from './Store';
export default class PresenceStore extends Store {
    constructor(client: DiscordClient);
    AddPresence(PresenceObject: Presence): void;
    UpdatePresence(UserId: string, PresenceObject: Presence): void;
    Get(UserId: string): Presence;
}
