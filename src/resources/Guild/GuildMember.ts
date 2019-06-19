import { IDiscordGuildMember, IDiscordUser } from '../../common/types';
import User from '../User/User';

export default class GuildMember {
  private static ResolveUser(UserObject: IDiscordUser): User {
    return new User(UserObject);
  }

  public User: User;
  public Roles: any[]; // TODO
  public JoinedAt: number;
  public Deaf: boolean;
  public Mute: boolean;

  public PremiumSince: number | undefined;
  public Nick: string | undefined;

  constructor(GuildMemberObject: IDiscordGuildMember) {
    this.User = GuildMember.ResolveUser(GuildMemberObject.user);
    this.Roles = GuildMemberObject.roles;
    this.JoinedAt = GuildMemberObject.joined_at;
    this.Deaf = GuildMemberObject.deaf;
    this.Mute = GuildMemberObject.mute;

    this.PremiumSince = GuildMemberObject.premium_since;
    this.Nick = GuildMemberObject.nick;
  }
}
