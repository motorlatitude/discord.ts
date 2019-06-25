import { IDiscordGuildMember } from '../../common/types';
import User from '../User/User';

export default class GuildMember {
  public User: User;
  public Roles: string[];
  public JoinedAt: number;
  public Deaf: boolean;
  public Mute: boolean;

  public PremiumSince: number | undefined;
  public Nick: string | undefined;

  constructor(GuildMemberObject: IDiscordGuildMember) {
    this.User = new User(GuildMemberObject.user);
    this.Roles = GuildMemberObject.roles;
    this.JoinedAt = GuildMemberObject.joined_at;
    this.Deaf = GuildMemberObject.deaf;
    this.Mute = GuildMemberObject.mute;

    this.PremiumSince = GuildMemberObject.premium_since;
    this.Nick = GuildMemberObject.nick;
  }

  public Resolve(): IDiscordGuildMember {
    return {
      deaf: this.Deaf,
      joined_at: this.JoinedAt,
      mute: this.Mute,
      nick: this.Nick,
      premium_since: this.PremiumSince,
      roles: this.Roles,
      user: this.User.Resolve(),
    };
  }
}
