import { IDiscordActivity, IDiscordActivityTimestamp, IDiscordAssets, IDiscordParty, IDiscordSecrets } from '../../common/types';
export default class Activity {
    Name: string;
    Type: number;
    URL?: string;
    Timestamps?: IDiscordActivityTimestamp;
    ApplicationId?: string;
    Details?: string;
    State?: string;
    Party?: IDiscordParty;
    Assets?: IDiscordAssets;
    Secrets?: IDiscordSecrets;
    Instance?: boolean;
    Flags?: number;
    constructor(ActivityObject: IDiscordActivity);
}
