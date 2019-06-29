import { IDiscordGuildBanGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildBanEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildBanGatewayEvent;

  public EventName?: 'GUILD_BAN_REMOVE' | 'GUILD_BAN_ADD';
  public EventGuildObject?: Guild;
  public EventUserObject?: User;

  constructor(client: DiscordClient, msg: IDiscordGuildBanGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Sent when a user is banned from a guild
   */
  public HandleBanAdd(): Promise<{ Guild: Guild; User: User }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          this.EventName = 'GUILD_BAN_ADD';

          AffectedGuild.Members.RemoveGuildMember(this.Message.user.id); // We don't store the ban, bans must be fetched separately through rest

          this.EventGuildObject = AffectedGuild;
          this.EventUserObject = new User(this.Message.user);

          this.Handle();
          resolve({
            Guild: this.EventGuildObject,
            User: this.EventUserObject,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Sent when a banned user is unbanned from the guild
   */
  public HandleBanRemove(): Promise<{ Guild: Guild; User: User }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          this.EventName = 'GUILD_BAN_REMOVE';

          this.EventGuildObject = AffectedGuild;
          this.EventUserObject = new User(this.Message.user);

          this.Handle();
          resolve({
            Guild: this.EventGuildObject,
            User: this.EventUserObject,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  public EmitEvent(): void {
    if (this.EventName && this.EventGuildObject && this.EventUserObject) {
      this.Client.emit(this.EventName, this.EventGuildObject, this.EventUserObject);
    }
  }
}
