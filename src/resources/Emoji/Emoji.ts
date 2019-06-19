import { IDiscordEmoji } from '../../common/types';
import User from '../User/User';

export default class Emoji {
  // 🥳 👨🏻‍💻 🦋 ✨

  public id: string;
  public Name: string;

  public Roles?: any[]; // TODO
  public User?: User;
  public RequireColons?: boolean;
  public Managed?: boolean;
  public Animated?: boolean;

  constructor(EmojiObject: IDiscordEmoji) {
    this.id = EmojiObject.id;
    this.Name = EmojiObject.name;

    this.Roles = EmojiObject.roles;
    if (EmojiObject.user) {
      this.User = new User(EmojiObject.user);
    }
    this.RequireColons = EmojiObject.require_colons;
    this.Managed = EmojiObject.managed;
    this.Animated = EmojiObject.animated;
  }
}
