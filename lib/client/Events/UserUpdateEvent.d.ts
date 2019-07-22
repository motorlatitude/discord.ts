import { IDiscordUser } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class UserUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordUser;
    readonly EventName: 'USER_UPDATE';
    EventUserObject?: User;
    constructor(client: DiscordClient, msg: IDiscordUser);
    /**
     * Handles USER_UPDATE event
     * Sent when properties about the current bot user change
     */
    Handle(): void;
    EmitEvent(): void;
}
