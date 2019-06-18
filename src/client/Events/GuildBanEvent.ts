import DiscordClient from '../../DiscordClient';
import ClientDispatcherEvent from './ClientDispatcherEvent';
import { IDiscordGuildBanGatewayEvent } from '../../common/types';
import Guild from '../../resources/Guild/Guild';


export default class GuildBanEvent extends ClientDispatcherEvent {

  public readonly Message: IDiscordGuildBanGatewayEvent;

  public EventName: string | undefined;
  public EventObject;

  constructor(client: DiscordClient, msg: IDiscordGuildBanGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Sent when a user is banned from a guild
   */
  public HandleBanAdd(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      this.EventName = "GUILD_BAN_ADD";

      AffectedGuild.Members.RemoveGuildMember(this.Message.user);


      this.Handle();
    })
  }

  public EmitEvent(): void {

  }

}