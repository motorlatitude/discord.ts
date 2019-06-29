import DiscordClient from '../DiscordClient';
import Guild from '../resources/Guild/Guild';
import Store from './Store';

export default class GuildStore extends Store {
  /**
   *
   * @param client
   * @constructor
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  public AddGuild(GuildToBeStored: Guild): void {
    this.Add(GuildToBeStored.id, GuildToBeStored).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.AddTextChannel.Store',
      });
    });
  }

  public ReplaceGuild(GuildId: string, NewGuild: Guild): void {
    this.Replace(GuildId, NewGuild).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildStore.ReplaceGuild.Store',
      });
    });
  }

  public RemoveGuild(GuildId: string): void {
    this.Delete(GuildId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.GuildStore.RemoveGuild.Store',
      });
    });
  }

  /**
   * Fetch a Guild From id
   * @param GuildId - guild id
   */
  public Fetch(GuildId: string): Promise<Guild> {
    return new Promise((resolve, reject) => {
      if (this.Get(GuildId)) {
        resolve(this.Get(GuildId));
      } else {
        reject(new Error('No Guild With That Id Exists'));
      }
    });
  }
}
