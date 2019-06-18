import { IDiscordGuild } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';


export default class GuildEvent extends ClientDispatcherEvent {

  public readonly Message: IDiscordGuild;

  public EventName: string | undefined;
  public EventObject: Guild | undefined;
  
  constructor(client: DiscordClient, msg: IDiscordGuild){
    super(client);

    this.Message = msg;

  }

  /**
   * Handles GUILD_CREATE event
   * GUILD_CREATE event is sent when bot lazy loads guilds after connecting to gateway and if the
   * bot actively joins a guild during the active session.
   */
  public HandleCreate(): void{
    this.EventName = "GUILD_CREATE";

    this.EventObject = new Guild(this.Client, this.Message);

    this.Client.Guilds.AddGuild(this.EventObject);

    this.Handle();
  }

  public EmitEvent(): void {
    if(this.EventName === "GUILD_CREATE" && this.EventObject instanceof Guild){
      this.Client.emit("GUILD_CREATE", this.EventObject);
    }
  }

}