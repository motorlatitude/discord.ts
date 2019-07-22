import DiscordClient from '../DiscordClient';
import Reaction from '../resources/Message/Reaction';
import Store from './Store';
export default class ReactionStore extends Store {
    constructor(client: DiscordClient);
    /**
     * Add a new reaction
     * @param ReactionObject
     */
    AddReaction(ReactionObject: Reaction): void;
    /**
     * Remove a reaction defined by the emoji name
     * @param EmojiName - name of emoji
     */
    RemoveReaction(EmojiName: string): void;
    /**
     * Add a new Reaction object if a reaction is not present, otherwise increment count
     * @param ReactionObject - A new reaction
     * @constructor
     */
    UpdateReaction(ReactionObject: Reaction): void;
    AsyncFetchAll(): Reaction[];
}
