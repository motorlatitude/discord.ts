import DiscordClient from '../DiscordClient';
import Guild from '../resources/Guild/Guild';
import Store from './Store';

export default class GuildStore extends Store {

  /**
   * 
   * @param client
   * @constructor
   */
  constructor(client: DiscordClient){
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

  /**
   * Fetch a Guild From id
   * @param GuildId - guild id
   */
  public Fetch(GuildId: string): Promise<Guild> {
    return new Promise((resolve) => {
      resolve(this.Get(GuildId));
    })
  }

}