import DiscordClient from '../DiscordClient';
import Emoji from '../resources/Guild/Emoji';
import Store from './Store';
export default class EmojiStore extends Store {
    /**
     *
     * @param client
     * @constructor
     */
    constructor(client: DiscordClient);
    /**
     * Add an emoji to the store
     * @param EmojiObject - Emoji to be stored
     * @constructor
     */
    AddEmoji(EmojiObject: Emoji): void;
    /**
     * Replace an emoji or add it if it already exists
     * @param EmojiId - the id of the emoji intended to be replaced
     * @param EmojiObject - new emoji object
     * @constructor
     */
    ReplaceEmoji(EmojiId: string, EmojiObject: Emoji): void;
}
