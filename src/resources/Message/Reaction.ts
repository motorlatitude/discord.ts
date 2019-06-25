import { IDiscordReaction } from '../../common/types';
import ReactionEmoji from './ReactionEmoji';

export default class Reaction {
  public Count: number = 0;
  public Me: boolean;
  public Emoji: ReactionEmoji;

  constructor(ReactionObject: IDiscordReaction) {
    this.Count = ReactionObject.count;
    this.Me = ReactionObject.me;
    this.Emoji = new ReactionEmoji(ReactionObject.emoji);
  }

  public Resolve(): IDiscordReaction {
    return {
      count: this.Count,
      emoji: this.Emoji.Resolve(),
      me: this.Me,
    };
  }
}
