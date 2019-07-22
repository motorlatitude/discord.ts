import { IDiscordResumedPackage } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class ResumedEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordResumedPackage;
    EventName: 'RESUMED';
    constructor(client: DiscordClient, msg: IDiscordResumedPackage);
    Handle(): void;
    EmitEvent(): void;
}
