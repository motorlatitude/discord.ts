import { IDiscordPartialEmoji } from '../../common/types';

export default class ReactionEmoji {
  public id?: string;
  public Name: string;

  constructor(ReactionEmojiObject: IDiscordPartialEmoji) {
    this.Name = ReactionEmojiObject.name;
    this.id = ReactionEmojiObject.id;
  }

  public Resolve(): IDiscordPartialEmoji {
    return {
      id: this.id,
      name: this.Name,
    };
  }
}
