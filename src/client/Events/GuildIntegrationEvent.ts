import { IDiscordGuildIntegrationUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildIntegrationEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildIntegrationUpdateGatewayEvent;

  public readonly EventName: 'GUILD_INTEGRATION_UPDATE' = 'GUILD_INTEGRATION_UPDATE';
  public EventObject?: Guild;

  constructor(client: DiscordClient, msg: IDiscordGuildIntegrationUpdateGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  public Handle(): Promise<Guild> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          this.EventObject = AffectedGuild;
          super.Handle();
          resolve(this.EventObject);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  public EmitEvent(): void {
    if (this.EventName && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }
}
