import { IDiscordUser } from '../../common/types';

export default class User {
  public id: string;
  public Username: string;
  public Discriminator: string;

  public PremiumType: number | undefined;
  public Flags: number | undefined;
  public Email: string | undefined;
  public Verified: boolean | undefined;
  public Locale: string | undefined;
  public MFAEnabled: boolean | undefined;
  public Bot: boolean | undefined;
  public Avatar: string | undefined;

  constructor(UserObject: IDiscordUser) {
    this.id = UserObject.id;
    this.Username = UserObject.username;
    this.Discriminator = UserObject.discriminator;

    this.PremiumType = UserObject.premium_type;
    this.Flags = UserObject.flags;
    this.Email = UserObject.email;
    this.Verified = UserObject.verified;
    this.Locale = UserObject.locale;
    this.MFAEnabled = UserObject.bot;
    this.Avatar = UserObject.avatar;
  }

  public Resolve(): IDiscordUser {
    return {
      avatar: this.Avatar,
      bot: this.Bot,
      discriminator: this.Discriminator,
      email: this.Email,
      flags: this.Flags,
      id: this.id,
      locale: this.Locale,
      mfa_enabled: this.MFAEnabled,
      premium_type: this.PremiumType,
      username: this.Username,
      verified: this.Verified,
    };
  }
}
