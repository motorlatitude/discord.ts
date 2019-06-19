import DiscordClient from '../DiscordClient';
import Emoji from '../resources/Emoji/Emoji';
import Store from './Store';

export default class EmojiStore extends Store {
  /**
   *
   * @param client
   * @constructor
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add an emoji to the store
   * @param EmojiObject - Emoji to be stored
   * @constructor
   */
  public AddEmoji(EmojiObject: Emoji): void {
    this.Add(EmojiObject.id, EmojiObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.EmojiStore.AddEmoji.Store',
      });
    });
  }

  /**
   * Replace an emoji or add it if it already exists
   * @param EmojiId - the id of the emoji intended to be replaced
   * @param EmojiObject - new emoji object
   * @constructor
   */
  public ReplaceEmoji(EmojiId: string, EmojiObject: Emoji): void {
    if (this.Get(EmojiId)) {
      this.Replace(EmojiId, EmojiObject).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.EmojiStore.ReplaceEmoji.Store',
        });
      });
    } else {
      this.AddEmoji(EmojiObject);
    }
  }
}
