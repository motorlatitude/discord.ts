import { IDiscordGuildMember } from '../../common/types';
import User from '../User/User';
export default class GuildMember {
    private static ResolveUser;
    User: User;
    Roles: string[];
    JoinedAt: number;
    Deaf: boolean;
    Mute: boolean;
    PremiumSince: number | undefined;
    Nick: string | undefined;
    constructor(GuildMemberObject: IDiscordGuildMember);
    Resolve(): IDiscordGuildMember;
}
