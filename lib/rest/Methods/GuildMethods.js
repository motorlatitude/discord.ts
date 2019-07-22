"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./../../common/constants/http");
var GuildMethods = /** @class */ (function () {
    function GuildMethods(r) {
        this.Requester = r;
    }
    /**
     * POST /guilds
     * @param GuildObject - the values which to use to create the guild
     */
    GuildMethods.prototype.CreateGuild = function (GuildObject) {
        return this.Requester.SendRequest(http_1.default.POST, '/guilds', GuildObject);
    };
    /**
     * GET /guilds/{guild.id}
     * @param GuildId - The id of the guild to fetch from the API
     */
    GuildMethods.prototype.GetGuild = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId);
    };
    /**
     * PATCH /guilds/{guild.id}
     * @param GuildId - the id of the guild to modify
     * @param Parameters - parameters to modify
     */
    GuildMethods.prototype.ModifyGuild = function (GuildId, Parameters) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId, Parameters);
    };
    /**
     * DELETE /guilds/{guild.id}
     * @param GuildId - The Id of the guild to be deleted
     */
    GuildMethods.prototype.DeleteGuild = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId);
    };
    /**
     * GET /guilds/{guild.id}/channels
     * @param GuildId - The id of the guild of which to fetch the channels
     */
    GuildMethods.prototype.GetGuildChannels = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/channels');
    };
    /**
     * POST /guilds/{guild.id}/channels
     * @param GuildId - the id where to add the new channel
     * @param ChannelObject - chanel object, only required prop is name
     */
    GuildMethods.prototype.CreateGuildChannel = function (GuildId, ChannelObject) {
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/channels', ChannelObject);
    };
    /**
     * PATCH /guilds/{guild.id}/channels
     * @param GuildId - the id of the guild in which the channel is
     * @param ChannelId - the id of the channel to be moved
     * @param Position - the new position of the channel
     */
    GuildMethods.prototype.ModifyGuildChanelPosition = function (GuildId, ChannelId, Position) {
        var Data = {
            id: ChannelId,
            position: Position,
        };
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/channels', Data);
    };
    /**
     * Fetch A Specific GuildMember by UserId
     * @param GuildId - the id of the guild where the member is
     * @param UserId - the user id of the member
     */
    GuildMethods.prototype.GetGuildMember = function (GuildId, UserId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/members/' + UserId);
    };
    /**
     * List members in a guild
     * @param GuildId - the id of the guild in which the members are
     * @param Limit - amount of results, max is 10000
     * @param After - the last user id of the previous page
     */
    GuildMethods.prototype.ListGuildMembers = function (GuildId, Limit, After) {
        var QueryString = '';
        if (Limit) {
            QueryString += '?limit=' + (Limit > 1000 ? 1000 : Limit);
        }
        if (After) {
            if (QueryString !== '') {
                QueryString += '&after=' + After;
            }
            else {
                QueryString += '?after=' + After;
            }
        }
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/members' + QueryString);
    };
    /**
     * PUT /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the guild id to which to add the member
     * @param UserId - the user id of the user to add
     * @param GuildMemberObject - the join object, a valid access_token is required for the user
     */
    GuildMethods.prototype.AddGuildMember = function (GuildId, UserId, GuildMemberObject) {
        return this.Requester.SendRequest(http_1.default.PUT, '/guilds/' + GuildId + '/members/' + UserId, GuildMemberObject);
    };
    /**
     * PATCH /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the id of the guild in which the user resides
     * @param UserId - the user id
     * @param ModifyGuildMemberObject - the modified guild member object
     */
    GuildMethods.prototype.ModifyGuildMember = function (GuildId, UserId, ModifyGuildMemberObject) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/members/' + UserId, ModifyGuildMemberObject);
    };
    /**
     * PATCH /guilds/{guild.id}/members/@me/nick
     * @param GuildId - the id of the guild in which to change your nickname
     * @param Nickname - the new nickname to use
     */
    GuildMethods.prototype.ModifyCurrentUserNick = function (GuildId, Nickname) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/members/@me/nick', {
            nick: Nickname,
        });
    };
    /**
     * PUT /guilds/{guild.id}/members/{user.id}/roles/{role.id}
     * @param GuildId - the guild id in which to modify the user
     * @param UserId - the user id to change roles of
     * @param RoleId - the role id to add to the user
     */
    GuildMethods.prototype.AddGuildMemberRole = function (GuildId, UserId, RoleId) {
        return this.Requester.SendRequest(http_1.default.PUT, '/guilds/' + GuildId + '/members/' + UserId + '/roles/' + RoleId);
    };
    /**
     * Delete /guilds/{guild.id}/members/{user.id}/roles/{role.id}
     * @param GuildId - the guild id in which to modify the user
     * @param UserId - the user id to change roles of
     * @param RoleId - the role id to remove from the user
     */
    GuildMethods.prototype.RemoveGuildMemberRole = function (GuildId, UserId, RoleId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId + '/members/' + UserId + '/roles/' + RoleId);
    };
    /**
     * DELETE /guilds/{guild.id}/members/{user.id}
     * @param GuildId - the guild id where the user should be removed from
     * @param UserId - the user id of the user
     */
    GuildMethods.prototype.RemoveGuildMember = function (GuildId, UserId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId + '/members/' + UserId);
    };
    /**
     * GET /guilds/{guild.id}/bans
     * @param GuildId - the id of the guild to get bans for
     */
    GuildMethods.prototype.GetGuildBans = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/bans');
    };
    /**
     * GET /guilds/{guild.id}/bans/{user.id}
     * @param GuildId the id of the guild in which the user is banned
     * @param UserId - the queried user's id
     */
    GuildMethods.prototype.GetGuildBan = function (GuildId, UserId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/bans/' + UserId);
    };
    /**
     * PUT /guilds/{guild.id}/bans/{user.id}
     * @param GuildId - the id of the guild in which to ban a user
     * @param UserId - the user id of the user to ban
     * @param DeleteMessageDays - number of days to delete messages for (0-7)
     * @param Reason - the reason for the ban
     */
    GuildMethods.prototype.CreateGuildBan = function (GuildId, UserId, DeleteMessageDays, Reason) {
        var Data = {
            'delete-message-days': DeleteMessageDays ? (DeleteMessageDays > 7 ? 7 : DeleteMessageDays) : undefined,
            reason: Reason,
        };
        return this.Requester.SendRequest(http_1.default.PUT, '/guilds/' + GuildId + '/bans/' + UserId, Data);
    };
    /**
     * DELETE /guilds/{guild.id}/bans/{user.id}
     * @param GuildId - the id of the guild in which to unban a user
     * @param UserId - the id of the user to unban
     */
    GuildMethods.prototype.RemoveGuildBan = function (GuildId, UserId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId + '/bans/' + UserId);
    };
    /**
     * Get /guilds/{guild.id}/roles
     * @param GuildId - the id o the guild of which to get roles for
     */
    GuildMethods.prototype.GetGuildRoles = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/roles');
    };
    /**
     * POST /guilds/{guild.id}/roles
     * @param GuildId - the id of the guild in which to create a role
     * @param RoleObject - the new role object
     */
    GuildMethods.prototype.CreateGuildRole = function (GuildId, RoleObject) {
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/roles', RoleObject);
    };
    /**
     * PATCH /guilds/{guild.id}/roles
     * @param GuildId - the id of the guild in which to move a role
     * @param RoleId - the id of the role to move
     * @param Position - the new position number of the role
     */
    GuildMethods.prototype.ModifyGuildRolePosition = function (GuildId, RoleId, Position) {
        var Data = {
            id: RoleId,
            position: Position,
        };
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/roles', Data);
    };
    /**
     * PATCH /guilds/{guild.id}/roles/{role.id}
     * @param GuildId - the id of the guild in which to modify the role
     * @param RoleId - the id of the role to modify
     * @param RoleObject - the properties of the role to change
     */
    GuildMethods.prototype.ModifyGuildRole = function (GuildId, RoleId, RoleObject) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/roles/' + RoleId, RoleObject);
    };
    /**
     * DELETE /guilds/{guild.id}/roles/{role.id}
     * @param GuildId - the id of the guild in which the role is
     * @param RoleId - the id of the role to be removed
     */
    GuildMethods.prototype.DeleteGuildRole = function (GuildId, RoleId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId + '/roles/' + RoleId);
    };
    /**
     * GET /guilds/{guild.id}/prune
     * @param GuildId - the id of the guild to get a prune count of
     * @param Days - the number of days to count prune for (1 or more)
     */
    GuildMethods.prototype.GetGuildPruneCount = function (GuildId, Days) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/prune?days=' + (Days < 1 ? 1 : Days));
    };
    /**
     * POST /guilds/{guild.id}/prune
     * @param GuildId - the guild id where to begin the prune
     * @param Days - the number of days to prune
     * @param ComputePruneCount - Whether pruned should be returned, discouraged for large guilds
     */
    GuildMethods.prototype.BeginGuildPrune = function (GuildId, Days, ComputePruneCount) {
        if (ComputePruneCount === void 0) { ComputePruneCount = false; }
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/prune?days=' + (Days < 1 ? 1 : Days) + '&compute_prune_count=' + ComputePruneCount);
    };
    /**
     * GET /guilds/{guild.id}/regions
     * @param GuildId - the guild id of which to fetch voice regions for
     */
    GuildMethods.prototype.GetGuildVoiceRegions = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/regions');
    };
    /**
     * GET /guilds/{guild.id}/invites
     * @param GuildId - the id of the guild to fetch invites for
     */
    GuildMethods.prototype.GetGuildInvites = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/invites');
    };
    /**
     * GET /guilds/{guild.id}/integrations
     * @param GuildId - id of guild to fetch integrations for
     */
    GuildMethods.prototype.GetGuildIntegrations = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/integrations');
    };
    /**
     * POST /guilds/{guild.id}/integrations
     * @param GuildId - the id of the guild to create a new integration in
     * @param IntegrationObject - the integration object
     * @constructor
     */
    GuildMethods.prototype.CreateGuildIntegration = function (GuildId, IntegrationObject) {
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/integrations', IntegrationObject);
    };
    /**
     * PATCH /guilds/{guild.id}/integrations/{integration.id}
     * @param GuildId - the id of the guild to modify the integration of
     * @param IntegrationId - the id of the integration to modify
     * @param ModifyIntegrationObject - properties to modify
     */
    GuildMethods.prototype.ModifyGuildIntegration = function (GuildId, IntegrationId, ModifyIntegrationObject) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/integrations/' + IntegrationId, ModifyIntegrationObject);
    };
    /**
     * DELETE /guilds/{guild.id}/integrations/{integration.id}
     * @param GuildId - the id of the guild to delete the integration of
     * @param IntegrationId - the id of the integration to delete
     */
    GuildMethods.prototype.DeleteGuildIntegration = function (GuildId, IntegrationId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/guilds/' + GuildId + '/integrations/' + IntegrationId);
    };
    /**
     * POST /guilds/{guild.id}/integrations/{integration.id}/sync
     * @param GuildId - the guild id where the integration is
     * @param IntegrationId - the id of the integration to sync
     */
    GuildMethods.prototype.SyncGuildIntegration = function (GuildId, IntegrationId) {
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/integrations/' + IntegrationId + '/sync');
    };
    /**
     * GET /guilds/{guild.id}/embed
     * @param GuildId - the id of the guild to fetch the embed for
     */
    GuildMethods.prototype.GetGuildEmbed = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/embed');
    };
    /**
     * PATCH /guilds/{guild.id}/embed
     * @param GuildId - the id of the guild of which to modify the embed
     * @param GuildEmbedObject - the
     * @constructor
     */
    GuildMethods.prototype.ModifyGuildEmbed = function (GuildId, GuildEmbedObject) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/guilds/' + GuildId + '/embed', GuildEmbedObject);
    };
    /**
     * GET /guilds/{guild.id}/vanity-url
     * @param GuildId - the id of the guild of which to get the vanity url
     */
    GuildMethods.prototype.GetGuildVanityURL = function (GuildId) {
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/vanity-url');
    };
    /**
     * GET/guilds/{guild.id}/widget.png
     * @param GuildId - the id of the guild of which to get the widget
     * @param Style - the style of the widget
     */
    GuildMethods.prototype.GetGuildWidgetImage = function (GuildId, Style) {
        if (Style === void 0) { Style = 'shield'; }
        return this.Requester.SendRequest(http_1.default.GET, '/guilds/' + GuildId + '/widget.png?style=' + Style);
    };
    return GuildMethods;
}());
exports.default = GuildMethods;
//# sourceMappingURL=GuildMethods.js.map