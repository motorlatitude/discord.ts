import {
  IEndpointChannelInvite,
  IEndpointChannelMessagesQuery, IEndpointChannelOverwriteObject, IEndpointEditMessage,
  IEndpointMessageDetailsObject,
  IEndpointModifyChannelObject, IEndpointReactionQuery,
} from '../../common/types/ChannelEndpoint.types';
import DiscordRequester from '../DiscordRequester';
import HTTP_CONSTANTS from './../../common/constants/http';

export default class ChannelsMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  /**
   * GET /channels/{channel.id}
   * @param ChannelId - the id of the channel to get
   */
  public GetChannel(ChannelId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId)
  }

  /**
   * PATCH /channels/{channel.id}
   * @param ChannelId - the id of the channel to be modified
   * @param ModifyChannelObject - the properties of the channel to modify
   */
  public ModifyChannel(ChannelId: string, ModifyChannelObject: IEndpointModifyChannelObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/channels/'+ChannelId, ModifyChannelObject);
  }

  /**
   * DELETE /channels/{channel.id}
   * @param ChannelId - the id of the channel to delete
   */
  public DeleteChannel(ChannelId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId);
  }

  /**
   * ALIAS DeleteChannel
   * DELETE /channels/{channel.id}
   * @param ChannelId - the id of the DM channel to close
   */
  public CloseChannel(ChannelId: string): Promise<any> {
    return this.DeleteChannel(ChannelId);
  }

  /**
   * GET /channels/{channel.id}/messages
   * @param ChannelId - the id of the text channel to retrieve messages for
   * @param Limit - the amount of results to return 1 - 100 (default: 50)
   * @param QueryObject - object with either around, after or about key with a message id as value
   */
  public GetChannelMessages(ChannelId: string, Limit: number = 50, QueryObject?: IEndpointChannelMessagesQuery): Promise<any> {
    let q = "?limit="+Limit;
    if(QueryObject){
      if(QueryObject.after){
        q += "&after="+QueryObject.after
      }
      else if(QueryObject.before){
        q += "&before="+QueryObject.before
      }
      else if(QueryObject.around){
        q += "&around="+QueryObject.around
      }
    }
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId+'/messages'+q)
  }

  /**
   * GET /channels/{channel.id}/messages/{message.id}
   * @param ChannelId - the id of the channel in which the message is
   * @param MessageId - the id of the message to retrieve
   */
  public GetChannelMessage(ChannelId: string, MessageId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId+'/messages/'+MessageId);
  }

  /**
   * POST /channels/{channel.id}/messages
   * @param ChannelId - the id of the text channel to send the message to
   * @param Content - the contents of the message
   * @param Details - additional details of the message
   */
  public CreateMessage(ChannelId: string, Content: string, Details: IEndpointMessageDetailsObject): Promise<any> {
    const Payload: any = Details;
    Payload.content = Content;
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/channels/'+ChannelId+'/messages', Payload);
  }

  /**
   * POST /channels/{channel.id}/messages
   * @param ChannelId - the id of the channel to send the message with uploaded file to
   * @param Content - the contents of the message
   * @param Details - additional details of the message
   * @param Filename - the file name of the uploaded file
   * @param File - the file data
   */
  public CreateMessageWithUpload(ChannelId: string, Content: string, Details: IEndpointMessageDetailsObject, Filename: string, File: any): Promise<any> {
    const Payload: any = Details;
    Payload.content = Content;
    return this.Requester.SendFormRequest(HTTP_CONSTANTS.POST, '/channels/'+ChannelId+'/messages', Payload, Filename, File);
  }

  /**
   * PUT /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
   * @param ChannelId - the channel id in which the message is
   * @param MessageId - the id of the message to add a reaction to
   * @param Emoji - the emoji to react with in the form `name:id`
   */
  public CreateReaction(ChannelId: string, MessageId: string, Emoji: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PUT, '/channels/'+ChannelId+'/messages/'+MessageId+'/reactions/'+Emoji+'/@me');
  }

  /**
   * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
   * @param ChannelId - the id of the channel in which the message is
   * @param MessageId - the id of the message to delete the reaction from
   * @param Emoji - the emoji reaction to be deleted in the form `name:id`
   */
  public DeleteOwnReaction(ChannelId: string, MessageId: string, Emoji: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/messages/'+MessageId+'/reactions/'+Emoji+'/@me');
  }

  /**
   * DELETE /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}
   * @param ChannelId - the id of the channel in which the message is
   * @param MessageId - the id of the message of which to remove a reaction
   * @param Emoji - the emoji reaction to be removed in the form `name:id`
   * @param UserId - the id of the user that added the reaction
   */
  public DeleteUserReaction(ChannelId: string, MessageId: string, Emoji: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/messages/'+MessageId+'/reactions/'+Emoji+'/'+UserId);
  }

  /**
   * GET /channels/{channel.id}/messages/{message.id}/reactions/{emoji}
   * @param ChannelId - the channel id of the channel in which the message is
   * @param MessageId - the id of the message to fetch reactions for
   * @param Emoji - the emoji for which to get users
   * @param AdditionalQuery - limit, before or after additional queries
   */
  public GetReactions(ChannelId: string, MessageId: string, Emoji: string, AdditionalQuery: IEndpointReactionQuery): Promise<any> {
    let QueryOptions = '?';
    Object.entries(AdditionalQuery).forEach(([key, value]) => (QueryOptions += key + '=' + value + '&'));
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId+'/messages/'+MessageId+'/reactions/'+Emoji+QueryOptions);
  }

  /**
   * DELETE /channels/{channel.id}/messages/{message.id}/reactions
   * @param ChannelId - the id of the channel in which the message is
   * @param MessageId - the id of the message of which to remove all reactions
   */
  public DeleteAllReactions(ChannelId: string, MessageId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/messages/'+MessageId+'/reactions');
  }

  /**
   * PATCH /channels/{channel.id}/messages/{message.id}
   * @param ChannelId - the id of the channel of where the message is
   * @param MessageId - the id of the message to edit
   * @param MessageEdit - the properties of the message to edit; content, and/or embed
   */
  public EditMessage(ChannelId: string, MessageId: string, MessageEdit: IEndpointEditMessage): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PATCH, '/channels/'+ChannelId+'/messages/'+MessageId, MessageEdit);
  }

  /**
   * DELETE /channels/{channel.id}/messages/{message.id}
   * @param ChannelId - the id of the channel in which the message to be deleted is
   * @param MessageId - the id of the message to delete
   */
  public DeleteMessage(ChannelId: string, MessageId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/messages/'+MessageId);
  }

  /**
   * POST /channels/{channel.id}/messages/bulk-delete
   * @param ChannelId - the id of the channel in which to delete messages
   * @param Messages - the id of the messages to delete in an array
   */
  public BulkDeleteMessage(ChannelId: string, Messages: string[]): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/channels/'+ChannelId+'/messages/bulk-delete', {messages: Messages});
  }

  /**
   * PUT /channels/{channel.id}/permissions/{overwrite.id}
   * @param ChannelId - the id of the channel for which to change overwrite permissions
   * @param OverwriteId - the id of the overwrite to modify
   * @param Overwrites - the modified overwrite
   */
  public EditChannelPermissions(ChannelId: string, OverwriteId: string, Overwrites: IEndpointChannelOverwriteObject): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PUT, '/channels/'+ChannelId+'/permissions/'+OverwriteId, Overwrites);
  }

  /**
   * GET /channels/{channel.id}/invites
   * @param ChannelId - the id of the channel to fetch invites for
   */
  public GetChannelInvites(ChannelId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId+'/invites');
  }

  /**
   * POST /channels/{channel.id}/invites
   * @param ChannelId - the id of the channel to create an invite for
   * @param ChannelInviteObject - invite properties
   */
  public CreateChannelInvite(ChannelId: string, ChannelInviteObject: IEndpointChannelInvite = {}): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/channels/'+ChannelId+'/invites', ChannelInviteObject);
  }

  /**
   * DELETE /channels/{channel.id}/permissions/{overwrite.id}
   * @param ChannelId - the id of the channel to be deleted
   * @param OverwriteId - the id of the channel overwrite to be removed
   */
  public DeleteChannelPermission(ChannelId: string, OverwriteId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/permissions/'+OverwriteId);
  }

  /**
   * POST /channels/{channel.id}/typing
   * @param ChannelId - the id of the channel
   */
  public TriggerTypingIndicator(ChannelId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.POST, '/channels/'+ChannelId+'/typing');
  }

  /**
   * GET /channels/{channel.id}/pins
   * @param ChannelId - the id of the channel
   */
  public GetPinnedMessages(ChannelId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/channels/'+ChannelId+'/pins');
  }

  /**
   * PUT /channels/{channel.id}/pins/{message.id}
   * @param ChannelId - the id of the channel in which to pin a message
   * @param MessageId - the id of the message to be pinned
   */
  public AddPinnedChannelMessage(ChannelId: string, MessageId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.PUT, '/channels/'+ChannelId+'/pins/'+MessageId);
  }

  /**
   * DELETE /channels/{channel.id}/pins/{message.id}
   * @param ChannelId - the id of the channel in which to delete a pinned message
   * @param MessageId - the id of the message to be removed
   */
  public DeletePinnedMessage(ChannelId: string, MessageId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/pins/'+MessageId);
  }

  /**
   * PUT /channels/{channel.id}/recipients/{user.id}
   * @param ChannelId - the íd of the channel in which to add a user
   * @param UserId - the id of the user to be added
   * @param AccessToken - the access token for the user to be added
   * @param Nickname - the nickname of the user being added
   */
  public GroupDMAddRecipient(ChannelId: string, UserId: string, AccessToken: string, Nickname: string): Promise<any> {
    const Payload = {
      access_token: AccessToken,
      nick: Nickname
    };
    return this.Requester.SendRequest(HTTP_CONSTANTS.PUT, '/channels/'+ChannelId+'/recipients/'+UserId, Payload);
  }

  /**
   * DELETE /channels/{channel.id}/recipients/{user.id}
   * @param ChannelId - the id of the channel from which to remove a recipient
   * @param UserId - the id of the user to remove as a recipient in the channel
   */
  public GroupDMRemoveRecipient(ChannelId: string, UserId: string): Promise<any> {
    return this.Requester.SendRequest(HTTP_CONSTANTS.DELETE, '/channels/'+ChannelId+'/recipients/'+UserId);
  }

}
