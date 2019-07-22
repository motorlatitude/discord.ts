import { IEndpointChannelInvite, IEndpointChannelMessagesQuery, IEndpointChannelOverwriteObject, IEndpointEditMessage, IEndpointMessageDetailsObject, IEndpointModifyChannelObject, IEndpointReactionQuery } from '../../common/types/ChannelEndpoint.types';
import DiscordRequester from '../DiscordRequester';
export default class ChannelsMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    /**
     * GET /channels/{channel.id}
     * @param ChannelId - the id of the channel to get
     */
    GetChannel(ChannelId: string): Promise<any>;
    /**
     * PATCH /channels/{channel.id}
     * @param ChannelId - the id of the channel to be modified
     * @param ModifyChannelObject - the properties of the channel to modify
     */
    ModifyChannel(ChannelId: string, ModifyChannelObject: IEndpointModifyChannelObject): Promise<any>;
    /**
     * DELETE /channels/{channel.id}
     * @param ChannelId - the id of the channel to delete
     */
    DeleteChannel(ChannelId: string): Promise<any>;
    /**
     * ALIAS DeleteChannel
     * DELETE /channels/{channel.id}
     * @param ChannelId - the id of the DM channel to close
     */
    CloseChannel(ChannelId: string): Promise<any>;
    /**
     * GET /channels/{channel.id}/messages
     * @param ChannelId - the id of the text channel to retrieve messages for
     * @param Limit - the amount of results to return 1 - 100 (default: 50)
     * @param QueryObject - object with either around, after or about key with a message id as value
     */
    GetChannelMessages(ChannelId: string, Limit?: number, QueryObject?: IEndpointChannelMessagesQuery): Promise<any>;
    /**
     * GET /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message to retrieve
     */
    GetChannelMessage(ChannelId: string, MessageId: string): Promise<any>;
    /**
     * POST /channels/{channel.id}/messages
     * @param ChannelId - the id of the text channel to send the message to
     * @param Content - the contents of the message
     * @param Details - additional details of the message
     */
    CreateMessage(ChannelId: string, Content: string, Details: IEndpointMessageDetailsObject): Promise<any>;
    /**
     * POST /channels/{channel.id}/messages
     * @param ChannelId - the id of the channel to send the message with uploaded file to
     * @param Content - the contents of the message
     * @param Details - additional details of the message
     * @param Filename - the file name of the uploaded file
     * @param File - the file data
     */
    CreateMessageWithUpload(ChannelId: string, Content: string, Details: IEndpointMessageDetailsObject, Filename: string, File: any): Promise<any>;
    /**
     * PUT /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
     * @param ChannelId - the channel id in which the message is
     * @param MessageId - the id of the message to add a reaction to
     * @param Emoji - the emoji to react with in the form `name:id`
     */
    CreateReaction(ChannelId: string, MessageId: string, Emoji: string): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message to delete the reaction from
     * @param Emoji - the emoji reaction to be deleted in the form `name:id`
     */
    DeleteOwnReaction(ChannelId: string, MessageId: string, Emoji: string): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message of which to remove a reaction
     * @param Emoji - the emoji reaction to be removed in the form `name:id`
     * @param UserId - the id of the user that added the reaction
     */
    DeleteUserReaction(ChannelId: string, MessageId: string, Emoji: string, UserId: string): Promise<any>;
    /**
     * GET /channels/{channel.id}/messages/{message.id}/reactions/{emoji}
     * @param ChannelId - the channel id of the channel in which the message is
     * @param MessageId - the id of the message to fetch reactions for
     * @param Emoji - the emoji for which to get users
     * @param AdditionalQuery - limit, before or after additional queries
     */
    GetReactions(ChannelId: string, MessageId: string, Emoji: string, AdditionalQuery: IEndpointReactionQuery): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}/reactions
     * @param ChannelId - the id of the channel in which the message is
     * @param MessageId - the id of the message of which to remove all reactions
     */
    DeleteAllReactions(ChannelId: string, MessageId: string): Promise<any>;
    /**
     * PATCH /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel of where the message is
     * @param MessageId - the id of the message to edit
     * @param MessageEdit - the properties of the message to edit; content, and/or embed
     */
    EditMessage(ChannelId: string, MessageId: string, MessageEdit: IEndpointEditMessage): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/messages/{message.id}
     * @param ChannelId - the id of the channel in which the message to be deleted is
     * @param MessageId - the id of the message to delete
     */
    DeleteMessage(ChannelId: string, MessageId: string): Promise<any>;
    /**
     * POST /channels/{channel.id}/messages/bulk-delete
     * @param ChannelId - the id of the channel in which to delete messages
     * @param Messages - the id of the messages to delete in an array
     */
    BulkDeleteMessage(ChannelId: string, Messages: string[]): Promise<any>;
    /**
     * PUT /channels/{channel.id}/permissions/{overwrite.id}
     * @param ChannelId - the id of the channel for which to change overwrite permissions
     * @param OverwriteId - the id of the overwrite to modify
     * @param Overwrites - the modified overwrite
     */
    EditChannelPermissions(ChannelId: string, OverwriteId: string, Overwrites: IEndpointChannelOverwriteObject): Promise<any>;
    /**
     * GET /channels/{channel.id}/invites
     * @param ChannelId - the id of the channel to fetch invites for
     */
    GetChannelInvites(ChannelId: string): Promise<any>;
    /**
     * POST /channels/{channel.id}/invites
     * @param ChannelId - the id of the channel to create an invite for
     * @param ChannelInviteObject - invite properties
     */
    CreateChannelInvite(ChannelId: string, ChannelInviteObject?: IEndpointChannelInvite): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/permissions/{overwrite.id}
     * @param ChannelId - the id of the channel to be deleted
     * @param OverwriteId - the id of the channel overwrite to be removed
     */
    DeleteChannelPermission(ChannelId: string, OverwriteId: string): Promise<any>;
    /**
     * POST /channels/{channel.id}/typing
     * @param ChannelId - the id of the channel
     */
    TriggerTypingIndicator(ChannelId: string): Promise<any>;
    /**
     * GET /channels/{channel.id}/pins
     * @param ChannelId - the id of the channel
     */
    GetPinnedMessages(ChannelId: string): Promise<any>;
    /**
     * PUT /channels/{channel.id}/pins/{message.id}
     * @param ChannelId - the id of the channel in which to pin a message
     * @param MessageId - the id of the message to be pinned
     */
    AddPinnedChannelMessage(ChannelId: string, MessageId: string): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/pins/{message.id}
     * @param ChannelId - the id of the channel in which to delete a pinned message
     * @param MessageId - the id of the message to be removed
     */
    DeletePinnedMessage(ChannelId: string, MessageId: string): Promise<any>;
    /**
     * PUT /channels/{channel.id}/recipients/{user.id}
     * @param ChannelId - the íd of the channel in which to add a user
     * @param UserId - the id of the user to be added
     * @param AccessToken - the access token for the user to be added
     * @param Nickname - the nickname of the user being added
     */
    GroupDMAddRecipient(ChannelId: string, UserId: string, AccessToken: string, Nickname: string): Promise<any>;
    /**
     * DELETE /channels/{channel.id}/recipients/{user.id}
     * @param ChannelId - the id of the channel from which to remove a recipient
     * @param UserId - the id of the user to remove as a recipient in the channel
     */
    GroupDMRemoveRecipient(ChannelId: string, UserId: string): Promise<any>;
}
