import { IGuildMemberList } from '../common/types';
import DiscordClient from '../DiscordClient';
import GuildMember from '../resources/Guild/GuildMember';
import Store from './Store';
export default class GuildMemberStore extends Store {
    constructor(client: DiscordClient);
    /**
     * Add a new guild member to the store
     * @param member - A Guild Member
     */
    AddGuildMember(member: GuildMember): void;
    /**
     * Replace an existing guild member in the store
     * @param UserId - User id of the guild member to replace
     * @param member - The guild member object that will replace the old one
     */
    ReplaceGuildMember(UserId: string, member: GuildMember): void;
    /**
     * Update an existing guild member or add a new guild member if the member doesn't already exist in the store
     * @param UserId - User id of the guild member to replace
     * @param member - the guild member object that will replace the old one or should be added
     */
    UpdateGuildMember(UserId: string, member: GuildMember): void;
    /**
     * Remove an existing guild member
     * @param UserId - User id of the guild member to remove
     */
    RemoveGuildMember(UserId: string): void;
    Fetch(UserId: string): Promise<GuildMember>;
    FetchAll(): Promise<IGuildMemberList>;
}
