import DiscordClient from '../DiscordClient';
import Message from '../resources/Message/Message';
import Store from './Store';
export default class MessageStore extends Store {
    constructor(client: DiscordClient);
    /**
     * Add a new message to the store
     * @param message - The message to store
     */
    AddMessage(message: Message): void;
    /**
     * Replace an existing message in the store
     * @param MessageId - the message id of the message to be replaced
     * @param message - the new message which will replace the old one
     */
    ReplaceMessage(MessageId: string, message: Message): void;
    /**
     * Delete an existing message in the store
     * @param MessageId - id of the message to delete
     */
    DeleteMessage(MessageId: string): void;
    /**
     * Async get message
     * @param MessageId - id of message
     * @constructor
     */
    Get(MessageId: string): Message;
    /**
     * Fetch message from message id
     * @param MessageId - the id of the message
     */
    Fetch(MessageId: string): Promise<Message>;
    /**
     * Fetch array of messages for an array of message ids
     * @param MessageIds - array of message ids
     */
    FetchAllFor(MessageIds: string[]): Promise<Message[]>;
}
