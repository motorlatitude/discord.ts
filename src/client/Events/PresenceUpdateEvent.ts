import { IDiscordPresenceUpdate } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import Presence from '../../resources/User/Presence';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class PresenceUpdateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordPresenceUpdate;

  public readonly EventName: 'PRESENCE_UPDATE' = 'PRESENCE_UPDATE';
  public EventNewPresence?: Presence;
  public EventOldPresence?: Presence;

  constructor(client: DiscordClient, msg: IDiscordPresenceUpdate) {
    super(client);

    this.Message = msg;
  }

  public Handle(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      const OldPresence: Presence | undefined = AffectedGuild.Presences.Get(this.Message.user.id);
      const NewPresence = new Presence(this.Client, this.Message);
      AffectedGuild.Presences.UpdatePresence(this.Message.user.id, NewPresence);

      this.EventNewPresence = NewPresence;
      this.EventOldPresence = OldPresence;

      super.Handle();
    });
  }

  public EmitEvent(): void {
    if (this.EventNewPresence) {
      this.Client.emit(this.EventName, this.EventNewPresence, this.EventOldPresence);
    }
  }
}
