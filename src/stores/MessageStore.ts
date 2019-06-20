import DiscordClient from '../DiscordClient';
import Message from '../resources/Message/Message';
import Store from './Store';

export default class MessageStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add a new message to the store
   * @param message - The message to store
   */
  public AddMessage(message: Message): void {
    this.Add(message.id, message).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.MessageStore.AddMessage.Store',
      });
    });
  }

  /**
   * Replace an existing message in the store
   * @param MessageId - the message id of the message to be replaced
   * @param message - the new message which will replace the old one
   */
  public ReplaceMessage(MessageId: string, message: Message): void {
    this.Replace(MessageId, message).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.MessageStore.ReplaceMessage.Store',
      });
    });
  }

  /**
   * Delete an existing message in the store
   * @param MessageId - id of the message to delete
   */
  public DeleteMessage(MessageId: string): void {
    this.Delete(MessageId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.MessageStore.DeleteMessage.Store',
      });
    });
  }

  /**
   * Fetch message from message id
   * @param MessageId - the id of the message
   */
  public Fetch(MessageId: string): Promise<Message> {
    return new Promise(resolve => {
      resolve(this.Get(MessageId));
    });
  }

  /**
   * Fetch array of messages for an array of message ids
   * @param MessageIds - array of message ids
   */
  public FetchAllFor(MessageIds: string[]): Promise<Message[]> {
    return new Promise(resolve => {
      resolve(this.GetAllForKeys(MessageIds));
    });
  }
}
