import { IDiscordUser } from '../../common/types';
export default class User {
    id: string;
    Username: string;
    Discriminator: string;
    PremiumType: number | undefined;
    Flags: number | undefined;
    Email: string | undefined;
    Verified: boolean | undefined;
    Locale: string | undefined;
    MFAEnabled: boolean | undefined;
    Bot: boolean | undefined;
    Avatar: string | undefined;
    constructor(UserObject: IDiscordUser);
    Resolve(): IDiscordUser;
}
