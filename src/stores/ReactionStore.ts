import DiscordClient from '../DiscordClient';
import Reaction from '../resources/Message/Reaction';
import Store from './Store';

export default class ReactionStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add a new reaction
   * @param ReactionObject
   */
  public AddReaction(ReactionObject: Reaction): void {
    this.Add(ReactionObject.Emoji.Name, ReactionObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ReactionStore.AddReaction.Store',
      });
    });
  }

  /**
   * Remove a reaction defined by the emoji name
   * @param EmojiName - name of emoji
   */
  public RemoveReaction(EmojiName: string): void {
    this.Delete(EmojiName).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ReactionStore.RemoveReaction.Store',
      });
    });
  }

  /**
   * Add a new Reaction object if a reaction is not present, otherwise increment count
   * @param ReactionObject - A new reaction
   * @constructor
   */
  public UpdateReaction(ReactionObject: Reaction): void {
    const reaction: Reaction = this.Get(ReactionObject.Emoji.Name);
    if (reaction) {
      reaction.Count += 1;
      this.Replace(ReactionObject.Emoji.Name, reaction).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.ReactionStore.UpdateReaction.Replace.Store',
        });
      });
    } else {
      this.AddReaction(ReactionObject);
    }
  }

  public AsyncFetchAll(): Reaction[] {
    const reactions: any = this.GetAll();
    const Output: Reaction[] = [];
    for (const react of reactions) {
      Output.push(react);
    }
    return Output;
  }
}
