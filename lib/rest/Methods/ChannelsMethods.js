"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./../../common/constants/http");
var ChannelsMethods = /** @class */ (function () {
    function ChannelsMethods(r) {
        this.Requester = r;
    }
    /**
     * GET /channels/{channel.id}
     * @param ChannelId - the id of the channel to get
     */
    ChannelsMethods.prototype.GetChannel = function (ChannelId) {
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId);
    };
    /**
     * PATCH /channels/{channel.id}
     * @param ChannelId - the id of the channel to be modified
     * @param ModifyChannelObject - the properties of the channel to modify
     */
    ChannelsMethods.prototype.ModifyChannel = function (ChannelId, ModifyChannelObject) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/channels/' + ChannelId, ModifyChannelObject);
    };
    /**
     * DELETE /channels/{channel.id}
     * @param ChannelId - the id of the channel to delete
     */
    ChannelsMethods.prototype.DeleteChannel = function (ChannelId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId);
    };
    /**
     * ALIAS DeleteChannel
     * DELETE /channels/{channel.id}
     * @param ChannelId - the id of the DM channel to close
     */
    ChannelsMethods.prototype.CloseChannel = function (ChannelId) {
        return this.DeleteChannel(ChannelId);
    };
    /**
     * GET /channels/{channel.id}/messages
     * @param ChannelId - the id of the text channel to retrieve messages for
     * @param Limit - the amount of results to return 1 - 100 (default: 50)
     * @param QueryObject - object with either around, after or about key with a message id as value
     */
    ChannelsMethods.prototype.GetChannelMessages = function (ChannelId, Limit, QueryObject) {
        if (Limit === void 0) { Limit = 50; }
        var q = "?limit=" + Limit;
        if (QueryObject) {
            if (QueryObject.after) {
                q += "&after=" + QueryObject.after;
            }
            else if (QueryObject.before) {
                q += "&before=" + QueryObject.before;
            }
            else if (QueryObject.around) {
                q += "&around=" + QueryObject.around;
            }
        }
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId + '/messages' + q);
    };
    /**
     * GET /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message to retrieve
     */
    ChannelsMethods.prototype.GetChannelMessage = function (ChannelId, MessageId) {
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId + '/messages/' + MessageId);
    };
    /**
     * POST /channels/{channel.id}/messages
     * @param ChannelId - the id of the text channel to send the message to
     * @param Content - the contents of the message
     * @param Details - additional details of the message
     */
    ChannelsMethods.prototype.CreateMessage = function (ChannelId, Content, Details) {
        var Payload = Details;
        Payload.content = Content;
        return this.Requester.SendRequest(http_1.default.POST, '/channels/' + ChannelId + '/messages', Payload);
    };
    /**
     * POST /channels/{channel.id}/messages
     * @param ChannelId - the id of the channel to send the message with uploaded file to
     * @param Content - the contents of the message
     * @param Details - additional details of the message
     * @param Filename - the file name of the uploaded file
     * @param File - the file data
     */
    ChannelsMethods.prototype.CreateMessageWithUpload = function (ChannelId, Content, Details, Filename, File) {
        var Payload = Details;
        Payload.content = Content;
        return this.Requester.SendFormRequest(http_1.default.POST, '/channels/' + ChannelId + '/messages', Payload, Filename, File);
    };
    /**
     * PUT /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
     * @param ChannelId - the channel id in which the message is
     * @param MessageId - the id of the message to add a reaction to
     * @param Emoji - the emoji to react with in the form `name:id`
     */
    ChannelsMethods.prototype.CreateReaction = function (ChannelId, MessageId, Emoji) {
        return this.Requester.SendRequest(http_1.default.PUT, '/channels/' + ChannelId + '/messages/' + MessageId + '/reactions/' + Emoji + '/@me');
    };
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message to delete the reaction from
     * @param Emoji - the emoji reaction to be deleted in the form `name:id`
     */
    ChannelsMethods.prototype.DeleteOwnReaction = function (ChannelId, MessageId, Emoji) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/messages/' + MessageId + '/reactions/' + Emoji + '/@me');
    };
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message of which to remove a reaction
     * @param Emoji - the emoji reaction to be removed in the form `name:id`
     * @param UserId - the id of the user that added the reaction
     */
    ChannelsMethods.prototype.DeleteUserReaction = function (ChannelId, MessageId, Emoji, UserId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/messages/' + MessageId + '/reactions/' + Emoji + '/' + UserId);
    };
    /**
     * GET /channels/{channel.id}/messages/{message.id}/reactions/{emoji}
     * @param ChannelId - the channel id of the channel in which the message is
     * @param MessageId - the id of the message to fetch reactions for
     * @param Emoji - the emoji for which to get users
     * @param AdditionalQuery - limit, before or after additional queries
     */
    ChannelsMethods.prototype.GetReactions = function (ChannelId, MessageId, Emoji, AdditionalQuery) {
        var QueryOptions = '?';
        Object.entries(AdditionalQuery).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return (QueryOptions += key + '=' + value + '&');
        });
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId + '/messages/' + MessageId + '/reactions/' + Emoji + QueryOptions);
    };
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message of which to remove all reactions
     */
    ChannelsMethods.prototype.DeleteAllReactions = function (ChannelId, MessageId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/messages/' + MessageId + '/reactions');
    };
    /**
     * PATCH /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel of where the message is
     * @param MessageId - the id of the message to edit
     * @param MessageEdit - the properties of the message to edit; content, and/or embed
     */
    ChannelsMethods.prototype.EditMessage = function (ChannelId, MessageId, MessageEdit) {
        return this.Requester.SendRequest(http_1.default.PATCH, '/channels/' + ChannelId + '/messages/' + MessageId, MessageEdit);
    };
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel in which the message to be deleted is
     * @param MessageId - the id of the message to delete
     */
    ChannelsMethods.prototype.DeleteMessage = function (ChannelId, MessageId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/messages/' + MessageId);
    };
    /**
     * POST /channels/{channel.id}/messages/bulk-delete
     * @param ChannelId - the id of the channel in which to delete messages
     * @param Messages - the id of the messages to delete in an array
     */
    ChannelsMethods.prototype.BulkDeleteMessage = function (ChannelId, Messages) {
        return this.Requester.SendRequest(http_1.default.POST, '/channels/' + ChannelId + '/messages/bulk-delete', { messages: Messages });
    };
    /**
     * PUT /channels/{channel.id}/permissions/{overwrite.id}
     * @param ChannelId - the id of the channel for which to change overwrite permissions
     * @param OverwriteId - the id of the overwrite to modify
     * @param Overwrites - the modified overwrite
     */
    ChannelsMethods.prototype.EditChannelPermissions = function (ChannelId, OverwriteId, Overwrites) {
        return this.Requester.SendRequest(http_1.default.PUT, '/channels/' + ChannelId + '/permissions/' + OverwriteId, Overwrites);
    };
    /**
     * GET /channels/{channel.id}/invites
     * @param ChannelId - the id of the channel to fetch invites for
     */
    ChannelsMethods.prototype.GetChannelInvites = function (ChannelId) {
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId + '/invites');
    };
    /**
     * POST /channels/{channel.id}/invites
     * @param ChannelId - the id of the channel to create an invite for
     * @param ChannelInviteObject - invite properties
     */
    ChannelsMethods.prototype.CreateChannelInvite = function (ChannelId, ChannelInviteObject) {
        if (ChannelInviteObject === void 0) { ChannelInviteObject = {}; }
        return this.Requester.SendRequest(http_1.default.POST, '/channels/' + ChannelId + '/invites', ChannelInviteObject);
    };
    /**
     * DELETE /channels/{channel.id}/permissions/{overwrite.id}
     * @param ChannelId - the id of the channel to be deleted
     * @param OverwriteId - the id of the channel overwrite to be removed
     */
    ChannelsMethods.prototype.DeleteChannelPermission = function (ChannelId, OverwriteId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/permissions/' + OverwriteId);
    };
    /**
     * POST /channels/{channel.id}/typing
     * @param ChannelId - the id of the channel
     */
    ChannelsMethods.prototype.TriggerTypingIndicator = function (ChannelId) {
        return this.Requester.SendRequest(http_1.default.POST, '/channels/' + ChannelId + '/typing');
    };
    /**
     * GET /channels/{channel.id}/pins
     * @param ChannelId - the id of the channel
     */
    ChannelsMethods.prototype.GetPinnedMessages = function (ChannelId) {
        return this.Requester.SendRequest(http_1.default.GET, '/channels/' + ChannelId + '/pins');
    };
    /**
     * PUT /channels/{channel.id}/pins/{message.id}
     * @param ChannelId - the id of the channel in which to pin a message
     * @param MessageId - the id of the message to be pinned
     */
    ChannelsMethods.prototype.AddPinnedChannelMessage = function (ChannelId, MessageId) {
        return this.Requester.SendRequest(http_1.default.PUT, '/channels/' + ChannelId + '/pins/' + MessageId);
    };
    /**
     * DELETE /channels/{channel.id}/pins/{message.id}
     * @param ChannelId - the id of the channel in which to delete a pinned message
     * @param MessageId - the id of the message to be removed
     */
    ChannelsMethods.prototype.DeletePinnedMessage = function (ChannelId, MessageId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/pins/' + MessageId);
    };
    /**
     * PUT /channels/{channel.id}/recipients/{user.id}
     * @param ChannelId - the íd of the channel in which to add a user
     * @param UserId - the id of the user to be added
     * @param AccessToken - the access token for the user to be added
     * @param Nickname - the nickname of the user being added
     */
    ChannelsMethods.prototype.GroupDMAddRecipient = function (ChannelId, UserId, AccessToken, Nickname) {
        var Payload = {
            access_token: AccessToken,
            nick: Nickname
        };
        return this.Requester.SendRequest(http_1.default.PUT, '/channels/' + ChannelId + '/recipients/' + UserId, Payload);
    };
    /**
     * DELETE /channels/{channel.id}/recipients/{user.id}
     * @param ChannelId - the id of the channel from which to remove a recipient
     * @param UserId - the id of the user to remove as a recipient in the channel
     */
    ChannelsMethods.prototype.GroupDMRemoveRecipient = function (ChannelId, UserId) {
        return this.Requester.SendRequest(http_1.default.DELETE, '/channels/' + ChannelId + '/recipients/' + UserId);
    };
    return ChannelsMethods;
}());
exports.default = ChannelsMethods;
//# sourceMappingURL=ChannelsMethods.js.map