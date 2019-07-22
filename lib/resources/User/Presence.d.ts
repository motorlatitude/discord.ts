import { IDiscordClientStatus, IDiscordPresenceUpdate } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import Activity from './Activity';
import User from './User';
export default class Presence {
    User: User | {
        id: string;
    };
    Roles?: string[];
    GuildId?: string;
    Status?: string;
    Activities?: Activity[];
    ClientStatus?: IDiscordClientStatus;
    Game?: Activity;
    constructor(Client: DiscordClient, PresenceObject: IDiscordPresenceUpdate, GuildInstance?: Guild);
}
