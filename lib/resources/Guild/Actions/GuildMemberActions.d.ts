import { IDiscordGuildMember } from '../../../common/types';
import { IEndpointGuildMemberObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildMemberActions extends GuildAction {
    /**
     * Get a specific guild member, this will call the API
     * @param UserId - the user id of the guild member to call
     */
    GetMember(UserId: string): Promise<IDiscordGuildMember>;
    /**
     * Get all guild members
     * @constructor
     */
    GetAllMembers(): Promise<IDiscordGuildMember[]>;
    /**
     * Add a new member to this guild
     * @param UserId - the user id of the user to add to the guild
     * @param GuildMemberObject - an object containing member information
     */
    AddMember(UserId: string, GuildMemberObject: IEndpointGuildMemberObject): Promise<IDiscordGuildMember>;
    /**
     * Remove a member from the guild
     * @param UserId - the user id of the member to be removed
     */
    RemoveMember(UserId: string): Promise<undefined>;
}
