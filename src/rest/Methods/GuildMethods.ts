import {
  IEndpointChannelObject,
  IEndpointGuildEmbedObject,
  IEndpointGuildMemberObject,
  IEndpointGuildObject,
  IEndpointGuildRole,
  IEndpointIntegrationObject,
  IEndpointModifyGuildMemberObject,
  IEndpointModifyIntegrationObject,
} from '../../common/types/GuildEndpoint.types';
import DiscordRequester from '../DiscordRequester';
import HTTP_CONSTANTS from './../../common/constants/http';

export default class GuildMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  /**
   * POST /guilds
   * @param GuildObject - the values which to use to create the guild
   */
  public CreateGuild(GuildObject: IEndpointGuildObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/guilds', GuildObject);
  }

  /**
   * GET /guilds/{guild.id}
   * @param GuildId - The id of the guild to fetch from the API
   */
  public GetGuild(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId);
  }

  /**
   * PATCH /guilds/{guild.id}
   * @param GuildId - the id of the guild to modify
   * @param Parameters - parameters to modify
   */
  public ModifyGuild(GuildId: string, Parameters: any): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId, Parameters);
  }

  /**
   * DELETE /guilds/{guild.id}
   * @param GuildId - The Id of the guild to be deleted
   */
  public DeleteGuild(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/guilds/' + GuildId);
  }

  /**
   * GET /guilds/{guild.id}/channels
   * @param GuildId - The id of the guild of which to fetch the channels
   */
  public GetGuildChannels(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/channels');
  }

  /**
   * POST /guilds/{guild.id}/channels
   * @param GuildId - the id where to add the new channel
   * @param ChannelObject - chanel object, only required prop is name
   */
  public CreateGuildChannel(GuildId: string, ChannelObject: IEndpointChannelObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/guilds/' + GuildId + '/channels', ChannelObject);
  }

  /**
   * PATCH /guilds/{guild.id}/channels
   * @param GuildId - the id of the guild in which the channel is
   * @param ChannelId - the id of the channel to be moved
   * @param Position - the new position of the channel
   */
  public ModifyGuildChanelPosition(GuildId: string, ChannelId: string, Position: number): Promise<any> {
    const Data = {
      id: ChannelId,
      position: Position,
    };
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId + '/channels', Data);
  }

  /**
   * Fetch A Specific GuildMember by UserId
   * @param GuildId - the id of the guild where the member is
   * @param UserId - the user id of the member
   */
  public GetGuildMember(GuildId: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/members/' + UserId);
  }

  /**
   * List members in a guild
   * @param GuildId - the id of the guild in which the members are
   * @param Limit - amount of results, max is 10000
   * @param After - the last user id of the previous page
   */
  public ListGuildMembers(GuildId: string, Limit?: number, After?: string): Promise<any> {
    let QueryString: string = '';
    if (Limit) {
      QueryString += '?limit=' + (Limit > 1000 ? 1000 : Limit);
    }
    if (After) {
      if (QueryString !== '') {
        QueryString += '&after=' + After;
      } else {
        QueryString += '?after=' + After;
      }
    }
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/members' + QueryString);
  }

  /**
   * PUT /guilds/{guild.id}/members/{user.id}
   * @param GuildId - the guild id to which to add the member
   * @param UserId - the user id of the user to add
   * @param GuildMemberObject - the join object, a valid access_token is required for the user
   */
  public AddGuildMember(GuildId: string, UserId: string, GuildMemberObject: IEndpointGuildMemberObject): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.PUT,
      '/guilds/' + GuildId + '/members/' + UserId,
      GuildMemberObject,
    );
  }

  /**
   * PATCH /guilds/{guild.id}/members/{user.id}
   * @param GuildId - the id of the guild in which the user resides
   * @param UserId - the user id
   * @param ModifyGuildMemberObject - the modified guild member object
   */
  public ModifyGuildMember(
    GuildId: string,
    UserId: string,
    ModifyGuildMemberObject: IEndpointModifyGuildMemberObject,
  ): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.PATCH,
      '/guilds/' + GuildId + '/members/' + UserId,
      ModifyGuildMemberObject,
    );
  }

  /**
   * PATCH /guilds/{guild.id}/members/@me/nick
   * @param GuildId - the id of the guild in which to change your nickname
   * @param Nickname - the new nickname to use
   */
  public ModifyCurrentUserNick(GuildId: string, Nickname: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId + '/members/@me/nick', {
      nick: Nickname,
    });
  }

  /**
   * PUT /guilds/{guild.id}/members/{user.id}/roles/{role.id}
   * @param GuildId - the guild id in which to modify the user
   * @param UserId - the user id to change roles of
   * @param RoleId - the role id to add to the user
   */
  public AddGuildMemberRole(GuildId: string, UserId: string, RoleId: string): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.PUT,
      '/guilds/' + GuildId + '/members/' + UserId + '/roles/' + RoleId,
    );
  }

  /**
   * Delete /guilds/{guild.id}/members/{user.id}/roles/{role.id}
   * @param GuildId - the guild id in which to modify the user
   * @param UserId - the user id to change roles of
   * @param RoleId - the role id to remove from the user
   */
  public RemoveGuildMemberRole(GuildId: string, UserId: string, RoleId: string): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.DELETE,
      '/guilds/' + GuildId + '/members/' + UserId + '/roles/' + RoleId,
    );
  }

  /**
   * DELETE /guilds/{guild.id}/members/{user.id}
   * @param GuildId - the guild id where the user should be removed from
   * @param UserId - the user id of the user
   */
  public RemoveGuildMember(GuildId: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/guilds/' + GuildId + '/members/' + UserId);
  }

  /**
   * GET /guilds/{guild.id}/bans
   * @param GuildId - the id of the guild to get bans for
   */
  public GetGuildBans(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/bans');
  }

  /**
   * GET /guilds/{guild.id}/bans/{user.id}
   * @param GuildId the id of the guild in which the user is banned
   * @param UserId - the queried user's id
   */
  public GetGuildBan(GuildId: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/bans/' + UserId);
  }

  /**
   * PUT /guilds/{guild.id}/bans/{user.id}
   * @param GuildId - the id of the guild in which to ban a user
   * @param UserId - the user id of the user to ban
   * @param DeleteMessageDays - number of days to delete messages for (0-7)
   * @param Reason - the reason for the ban
   */
  public CreateGuildBan(GuildId: string, UserId: string, DeleteMessageDays?: number, Reason?: string): Promise<any> {
    const Data = {
      'delete-message-days': DeleteMessageDays ? (DeleteMessageDays > 7 ? 7 : DeleteMessageDays) : undefined,
      reason: Reason,
    };
    return this.Requester.SendRequest(HTTP_CONSTANTS.PUT, '/guilds/' + GuildId + '/bans/' + UserId, Data);
  }

  /**
   * DELETE /guilds/{guild.id}/bans/{user.id}
   * @param GuildId - the id of the guild in which to unban a user
   * @param UserId - the id of the user to unban
   */
  public RemoveGuildBan(GuildId: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/guilds/' + GuildId + '/bans/' + UserId);
  }

  /**
   * Get /guilds/{guild.id}/roles
   * @param GuildId - the id o the guild of which to get roles for
   */
  public GetGuildRoles(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/roles');
  }

  /**
   * POST /guilds/{guild.id}/roles
   * @param GuildId - the id of the guild in which to create a role
   * @param RoleObject - the new role object
   */
  public CreateGuildRole(GuildId: string, RoleObject: IEndpointGuildRole): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/guilds/' + GuildId + '/roles', RoleObject);
  }

  /**
   * PATCH /guilds/{guild.id}/roles
   * @param GuildId - the id of the guild in which to move a role
   * @param RoleId - the id of the role to move
   * @param Position - the new position number of the role
   */
  public ModifyGuildRolePosition(GuildId: string, RoleId: string, Position: number): Promise<any> {
    const Data = {
      id: RoleId,
      position: Position,
    };
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId + '/roles', Data);
  }

  /**
   * PATCH /guilds/{guild.id}/roles/{role.id}
   * @param GuildId - the id of the guild in which to modify the role
   * @param RoleId - the id of the role to modify
   * @param RoleObject - the properties of the role to change
   */
  public ModifyGuildRole(GuildId: string, RoleId: string, RoleObject: IEndpointGuildRole): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId + '/roles/' + RoleId, RoleObject);
  }

  /**
   * DELETE /guilds/{guild.id}/roles/{role.id}
   * @param GuildId - the id of the guild in which the role is
   * @param RoleId - the id of the role to be removed
   */
  public DeleteGuildRole(GuildId: string, RoleId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/guilds/' + GuildId + '/roles/' + RoleId);
  }

  /**
   * GET /guilds/{guild.id}/prune
   * @param GuildId - the id of the guild to get a prune count of
   * @param Days - the number of days to count prune for (1 or more)
   */
  public GetGuildPruneCount(GuildId: string, Days: number): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.GET,
      '/guilds/' + GuildId + '/prune?days=' + (Days < 1 ? 1 : Days),
    );
  }

  /**
   * POST /guilds/{guild.id}/prune
   * @param GuildId - the guild id where to begin the prune
   * @param Days - the number of days to prune
   * @param ComputePruneCount - Whether pruned should be returned, discouraged for large guilds
   */
  public BeginGuildPrune(GuildId: string, Days: number, ComputePruneCount: boolean = false): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.POST,
      '/guilds/' + GuildId + '/prune?days=' + (Days < 1 ? 1 : Days) + '&compute_prune_count=' + ComputePruneCount,
    );
  }

  /**
   * GET /guilds/{guild.id}/regions
   * @param GuildId - the guild id of which to fetch voice regions for
   */
  public GetGuildVoiceRegions(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/regions');
  }

  /**
   * GET /guilds/{guild.id}/invites
   * @param GuildId - the id of the guild to fetch invites for
   */
  public GetGuildInvites(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/invites');
  }

  /**
   * GET /guilds/{guild.id}/integrations
   * @param GuildId - id of guild to fetch integrations for
   */
  public GetGuildIntegrations(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/integrations');
  }

  /**
   * POST /guilds/{guild.id}/integrations
   * @param GuildId - the id of the guild to create a new integration in
   * @param IntegrationObject - the integration object
   * @constructor
   */
  public CreateGuildIntegration(GuildId: string, IntegrationObject: IEndpointIntegrationObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/guilds/' + GuildId + '/integrations', IntegrationObject);
  }

  /**
   * PATCH /guilds/{guild.id}/integrations/{integration.id}
   * @param GuildId - the id of the guild to modify the integration of
   * @param IntegrationId - the id of the integration to modify
   * @param ModifyIntegrationObject - properties to modify
   */
  public ModifyGuildIntegration(
    GuildId: string,
    IntegrationId: string,
    ModifyIntegrationObject: IEndpointModifyIntegrationObject,
  ): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.PATCH,
      '/guilds/' + GuildId + '/integrations/' + IntegrationId,
      ModifyIntegrationObject,
    );
  }

  /**
   * DELETE /guilds/{guild.id}/integrations/{integration.id}
   * @param GuildId - the id of the guild to delete the integration of
   * @param IntegrationId - the id of the integration to delete
   */
  public DeleteGuildIntegration(GuildId: string, IntegrationId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/guilds/' + GuildId + '/integrations/' + IntegrationId);
  }

  /**
   * POST /guilds/{guild.id}/integrations/{integration.id}/sync
   * @param GuildId - the guild id where the integration is
   * @param IntegrationId - the id of the integration to sync
   */
  public SyncGuildIntegration(GuildId: string, IntegrationId: string): Promise<any> {
    return this.Requester.SendRequest(
      HTTP_CONSTANTS.POST,
      '/guilds/' + GuildId + '/integrations/' + IntegrationId + '/sync',
    );
  }

  /**
   * GET /guilds/{guild.id}/embed
   * @param GuildId - the id of the guild to fetch the embed for
   */
  public GetGuildEmbed(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/embed');
  }

  /**
   * PATCH /guilds/{guild.id}/embed
   * @param GuildId - the id of the guild of which to modify the embed
   * @param GuildEmbedObject - the
   * @constructor
   */
  public ModifyGuildEmbed(GuildId: string, GuildEmbedObject: IEndpointGuildEmbedObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/guilds/' + GuildId + '/embed', GuildEmbedObject);
  }

  /**
   * GET /guilds/{guild.id}/vanity-url
   * @param GuildId - the id of the guild of which to get the vanity url
   */
  public GetGuildVanityURL(GuildId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/vanity-url');
  }

  /**
   * GET/guilds/{guild.id}/widget.png
   * @param GuildId - the id of the guild of which to get the widget
   * @param Style - the style of the widget
   */
  public GetGuildWidgetImage(GuildId: string, Style: string = 'shield'): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/guilds/' + GuildId + '/widget.png?style=' + Style);
  }
}
