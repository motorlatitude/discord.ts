import { IGuildMemberList } from '../common/types';
import DiscordClient from '../DiscordClient';
import GuildMember from '../resources/Guild/GuildMember';
import Store from './Store';

export default class GuildMemberStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  public AddGuildMember(member: GuildMember): void {
    this.Add(member.User.id, member).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildMemberStore.AddGuildMember.Store',
      });
    });
  }

  public RemoveGuildMember(UserId: string): void {
    this.Delete(UserId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildMemberStore.RemoveGuildMember.Store',
      });
    });
  }

  public FetchAll(): Promise<IGuildMemberList> {
    return new Promise(resolve => {
      resolve(this.GetAll());
    });
  }
}
