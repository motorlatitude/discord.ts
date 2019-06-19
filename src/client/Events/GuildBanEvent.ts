import { IDiscordGuildBanGatewayEvent, IGuildBanEventObject } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildBanEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildBanGatewayEvent;

  public EventName?: 'GUILD_BAN_REMOVE' | 'GUILD_BAN_ADD';
  public EventObject?: IGuildBanEventObject;

  constructor(client: DiscordClient, msg: IDiscordGuildBanGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Sent when a user is banned from a guild
   */
  public HandleBanAdd(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      this.EventName = 'GUILD_BAN_ADD';

      AffectedGuild.Members.RemoveGuildMember(this.Message.user.id); // We don't store the ban, bans must be fetched separately through rest

      this.EventObject = {
        Guild: AffectedGuild,
        User: new User(this.Message.user),
      };

      this.Handle();
    });
  }

  /**
   * Sent when a banned user is unbanned from the guild
   */
  public HandleBanRemove(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      this.EventName = 'GUILD_BAN_REMOVE';

      this.EventObject = {
        Guild: AffectedGuild,
        User: new User(this.Message.user),
      };

      this.Handle();
    });
  }

  public EmitEvent(): void {
    if(this.EventName && this.EventObject){
      this.Client.emit(this.EventName, this.EventObject)
    }
  }
}
