import DiscordClient from '../DiscordClient';
import GuildMember from '../resources/Guild/GuildMember';
import Store from './Store';

export default class GuildMemberStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add a new guild member to the store
   * @param member - A Guild Member
   */
  public AddGuildMember(member: GuildMember): void {
    // WARN - temporary check, follow github issue #997
    // https://github.com/discordapp/discord-api-docs/issues/997
    if(!this.Get(member.User.id)){
      this.Add(member.User.id, member).catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'DiscordClient.GuildMemberStore.AddGuildMember.Store',
        });
      });
    }
  }

  /**
   * Replace an existing guild member in the store
   * @param UserId - User id of the guild member to replace
   * @param member - The guild member object that will replace the old one
   */
  public ReplaceGuildMember(UserId: string, member: GuildMember): void {
    this.Replace(UserId, member).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildMemberStore.ReplaceGuildMember.Store',
      });
    });
  }

  /**
   * Update an existing guild member or add a new guild member if the member doesn't already exist in the store
   * @param UserId - User id of the guild member to replace
   * @param member - the guild member object that will replace the old one or should be added
   */
  public UpdateGuildMember(UserId: string, member: GuildMember): void {
    if (this.Get(UserId)) {
      this.ReplaceGuildMember(UserId, member);
    } else {
      this.AddGuildMember(member);
    }
  }

  /**
   * Remove an existing guild member
   * @param UserId - User id of the guild member to remove
   */
  public RemoveGuildMember(UserId: string): void {
    this.Delete(UserId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildMemberStore.RemoveGuildMember.Store',
      });
    });
  }

  public Fetch(UserId: string): Promise<GuildMember> {
    return new Promise(resolve => {
      resolve(this.Get(UserId));
    });
  }
}
