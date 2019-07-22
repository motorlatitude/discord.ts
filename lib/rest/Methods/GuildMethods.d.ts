import { IEndpointChannelObject, IEndpointGuildEmbedObject, IEndpointGuildMemberObject, IEndpointGuildObject, IEndpointGuildRole, IEndpointIntegrationObject, IEndpointModifyGuildMemberObject, IEndpointModifyIntegrationObject } from '../../common/types/GuildEndpoint.types';
import DiscordRequester from '../DiscordRequester';
export default class GuildMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    /**
     * POST /guilds
     * @param GuildObject - the values which to use to create the guild
     */
    CreateGuild(GuildObject: IEndpointGuildObject): Promise<any>;
    /**
     * GET /guilds/{guild.id}
     * @param GuildId - The id of the guild to fetch from the API
     */
    GetGuild(GuildId: string): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}
     * @param GuildId - the id of the guild to modify
     * @param Parameters - parameters to modify
     */
    ModifyGuild(GuildId: string, Parameters: any): Promise<any>;
    /**
     * DELETE /guilds/{guild.id}
     * @param GuildId - The Id of the guild to be deleted
     */
    DeleteGuild(GuildId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/channels
     * @param GuildId - The id of the guild of which to fetch the channels
     */
    GetGuildChannels(GuildId: string): Promise<any>;
    /**
     * POST /guilds/{guild.id}/channels
     * @param GuildId - the id where to add the new channel
     * @param ChannelObject - chanel object, only required prop is name
     */
    CreateGuildChannel(GuildId: string, ChannelObject: IEndpointChannelObject): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/channels
     * @param GuildId - the id of the guild in which the channel is
     * @param ChannelId - the id of the channel to be moved
     * @param Position - the new position of the channel
     */
    ModifyGuildChanelPosition(GuildId: string, ChannelId: string, Position: number): Promise<any>;
    /**
     * Fetch A Specific GuildMember by UserId
     * @param GuildId - the id of the guild where the member is
     * @param UserId - the user id of the member
     */
    GetGuildMember(GuildId: string, UserId: string): Promise<any>;
    /**
     * List members in a guild
     * @param GuildId - the id of the guild in which the members are
     * @param Limit - amount of results, max is 10000
     * @param After - the last user id of the previous page
     */
    ListGuildMembers(GuildId: string, Limit?: number, After?: string): Promise<any>;
    /**
     * PUT /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the guild id to which to add the member
     * @param UserId - the user id of the user to add
     * @param GuildMemberObject - the join object, a valid access_token is required for the user
     */
    AddGuildMember(GuildId: string, UserId: string, GuildMemberObject: IEndpointGuildMemberObject): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the id of the guild in which the user resides
     * @param UserId - the user id
     * @param ModifyGuildMemberObject - the modified guild member object
     */
    ModifyGuildMember(GuildId: string, UserId: string, ModifyGuildMemberObject: IEndpointModifyGuildMemberObject): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/members/@me/nick
     * @param GuildId - the id of the guild in which to change your nickname
     * @param Nickname - the new nickname to use
     */
    ModifyCurrentUserNick(GuildId: string, Nickname: string): Promise<any>;
    /**
     * PUT /guilds/{guild.id}/members/{user.id}/roles/{role.id}
     * @param GuildId - the guild id in which to modify the user
     * @param UserId - the user id to change roles of
     * @param RoleId - the role id to add to the user
     */
    AddGuildMemberRole(GuildId: string, UserId: string, RoleId: string): Promise<any>;
    /**
     * Delete /guilds/{guild.id}/members/{user.id}/roles/{role.id}
     * @param GuildId - the guild id in which to modify the user
     * @param UserId - the user id to change roles of
     * @param RoleId - the role id to remove from the user
     */
    RemoveGuildMemberRole(GuildId: string, UserId: string, RoleId: string): Promise<any>;
    /**
     * DELETE /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the guild id where the user should be removed from
     * @param UserId - the user id of the user
     */
    RemoveGuildMember(GuildId: string, UserId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/bans
     * @param GuildId - the id of the guild to get bans for
     */
    GetGuildBans(GuildId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/bans/{user.id}
     * @param GuildId the id of the guild in which the user is banned
     * @param UserId - the queried user's id
     */
    GetGuildBan(GuildId: string, UserId: string): Promise<any>;
    /**
     * PUT /guilds/{guild.id}/bans/{user.id}
     * @param GuildId - the id of the guild in which to ban a user
     * @param UserId - the user id of the user to ban
     * @param DeleteMessageDays - number of days to delete messages for (0-7)
     * @param Reason - the reason for the ban
     */
    CreateGuildBan(GuildId: string, UserId: string, DeleteMessageDays?: number, Reason?: string): Promise<any>;
    /**
     * DELETE /guilds/{guild.id}/bans/{user.id}
     * @param GuildId - the id of the guild in which to unban a user
     * @param UserId - the id of the user to unban
     */
    RemoveGuildBan(GuildId: string, UserId: string): Promise<any>;
    /**
     * Get /guilds/{guild.id}/roles
     * @param GuildId - the id o the guild of which to get roles for
     */
    GetGuildRoles(GuildId: string): Promise<any>;
    /**
     * POST /guilds/{guild.id}/roles
     * @param GuildId - the id of the guild in which to create a role
     * @param RoleObject - the new role object
     */
    CreateGuildRole(GuildId: string, RoleObject: IEndpointGuildRole): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/roles
     * @param GuildId - the id of the guild in which to move a role
     * @param RoleId - the id of the role to move
     * @param Position - the new position number of the role
     */
    ModifyGuildRolePosition(GuildId: string, RoleId: string, Position: number): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/roles/{role.id}
     * @param GuildId - the id of the guild in which to modify the role
     * @param RoleId - the id of the role to modify
     * @param RoleObject - the properties of the role to change
     */
    ModifyGuildRole(GuildId: string, RoleId: string, RoleObject: IEndpointGuildRole): Promise<any>;
    /**
     * DELETE /guilds/{guild.id}/roles/{role.id}
     * @param GuildId - the id of the guild in which the role is
     * @param RoleId - the id of the role to be removed
     */
    DeleteGuildRole(GuildId: string, RoleId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/prune
     * @param GuildId - the id of the guild to get a prune count of
     * @param Days - the number of days to count prune for (1 or more)
     */
    GetGuildPruneCount(GuildId: string, Days: number): Promise<any>;
    /**
     * POST /guilds/{guild.id}/prune
     * @param GuildId - the guild id where to begin the prune
     * @param Days - the number of days to prune
     * @param ComputePruneCount - Whether pruned should be returned, discouraged for large guilds
     */
    BeginGuildPrune(GuildId: string, Days: number, ComputePruneCount?: boolean): Promise<any>;
    /**
     * GET /guilds/{guild.id}/regions
     * @param GuildId - the guild id of which to fetch voice regions for
     */
    GetGuildVoiceRegions(GuildId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/invites
     * @param GuildId - the id of the guild to fetch invites for
     */
    GetGuildInvites(GuildId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/integrations
     * @param GuildId - id of guild to fetch integrations for
     */
    GetGuildIntegrations(GuildId: string): Promise<any>;
    /**
     * POST /guilds/{guild.id}/integrations
     * @param GuildId - the id of the guild to create a new integration in
     * @param IntegrationObject - the integration object
     * @constructor
     */
    CreateGuildIntegration(GuildId: string, IntegrationObject: IEndpointIntegrationObject): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/integrations/{integration.id}
     * @param GuildId - the id of the guild to modify the integration of
     * @param IntegrationId - the id of the integration to modify
     * @param ModifyIntegrationObject - properties to modify
     */
    ModifyGuildIntegration(GuildId: string, IntegrationId: string, ModifyIntegrationObject: IEndpointModifyIntegrationObject): Promise<any>;
    /**
     * DELETE /guilds/{guild.id}/integrations/{integration.id}
     * @param GuildId - the id of the guild to delete the integration of
     * @param IntegrationId - the id of the integration to delete
     */
    DeleteGuildIntegration(GuildId: string, IntegrationId: string): Promise<any>;
    /**
     * POST /guilds/{guild.id}/integrations/{integration.id}/sync
     * @param GuildId - the guild id where the integration is
     * @param IntegrationId - the id of the integration to sync
     */
    SyncGuildIntegration(GuildId: string, IntegrationId: string): Promise<any>;
    /**
     * GET /guilds/{guild.id}/embed
     * @param GuildId - the id of the guild to fetch the embed for
     */
    GetGuildEmbed(GuildId: string): Promise<any>;
    /**
     * PATCH /guilds/{guild.id}/embed
     * @param GuildId - the id of the guild of which to modify the embed
     * @param GuildEmbedObject - the
     * @constructor
     */
    ModifyGuildEmbed(GuildId: string, GuildEmbedObject: IEndpointGuildEmbedObject): Promise<any>;
    /**
     * GET /guilds/{guild.id}/vanity-url
     * @param GuildId - the id of the guild of which to get the vanity url
     */
    GetGuildVanityURL(GuildId: string): Promise<any>;
    /**
     * GET/guilds/{guild.id}/widget.png
     * @param GuildId - the id of the guild of which to get the widget
     * @param Style - the style of the widget
     */
    GetGuildWidgetImage(GuildId: string, Style?: string): Promise<any>;
}
