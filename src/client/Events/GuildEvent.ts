import { IDiscordGuild, IDiscordUnavailableGuildObject, IGuildDeleteEventObject } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildEvent extends ClientDispatcherEvent {
  public EventName: string | undefined;
  public EventObject: Guild | undefined;
  public EventDeleteObject: IGuildDeleteEventObject | undefined;

  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Handles GUILD_CREATE event
   * GUILD_CREATE event is sent when
   * 1. When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the Ready event.
   * 2. When a Guild becomes available again to the client.
   * 3. When the current user joins a new Guild.
   * https://discordapp.com/developers/docs/topics/gateway#guild-create
   * @param Message GUILD_CREATE event package
   */
  public HandleCreate(Message: IDiscordGuild): Promise<Guild> {
    return new Promise((resolve) => {
      this.EventName = 'GUILD_CREATE';

      this.EventObject = new Guild(this.Client, Message);

      this.Client.Guilds.AddGuild(this.EventObject);

      this.Handle();
      resolve(this.EventObject);
    });
  }

  /**
   * Handles GUILD_UPDATE event
   * @param Message GUILD_UPDATE event package
   */
  public HandleUpdate(Message: IDiscordGuild): Promise<Guild> {
    return new Promise((resolve) => {
      this.EventName = 'GUILD_UPDATE';

      this.EventObject = new Guild(this.Client, Message);

      this.Client.Guilds.ReplaceGuild(Message.id, this.EventObject);

      this.Handle();
      resolve(this.EventObject);
    })
  }

  /**
   * Handles GUILD_DELETE event
   * @param Message GUILD_DELETE event package
   */
  public HandleDelete(Message: IDiscordUnavailableGuildObject): Promise<IGuildDeleteEventObject> {
    return new Promise((resolve) => {
      this.EventName = 'GUILD_DELETE';

      let WasKicked: boolean = false;
      if (Message.unavailable === undefined || Message.unavailable === null) {
        WasKicked = true;
      }

      this.EventDeleteObject = {
        Unavailable: Message.unavailable,
        WasRemoved: WasKicked,
        id: Message.id,
      };

      this.Client.Guilds.RemoveGuild(Message.id);

      this.Handle();
      resolve(this.EventDeleteObject);
    })
  }

  public EmitEvent(): void {
    if (this.EventName === 'GUILD_CREATE' || this.EventName === 'GUILD_UPDATE') {
      if (this.EventObject instanceof Guild) {
        this.Client.emit(this.EventName, this.EventObject);
      }
    } else if (this.EventName === 'GUILD_DELETE') {
      if (this.EventDeleteObject) {
        this.Client.emit(this.EventName, this.EventDeleteObject);
      }
    }
  }
}
