import { IDiscordClientStatus, IDiscordPresenceUpdate } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../Guild/Guild';
import GuildMember from '../Guild/GuildMember';
import Activity from './Activity';
import User from './User';

export default class Presence {
  /* WARN The user object within this event can be partial, the only field which must be sent is the id field,
   * everything else is optional. Along with this limitation, no fields are required, and the types of the fields
   * are not validated. Your client should expect any combination of fields and types within this event.
   */

  public User: User | {id: string};
  public Roles?: string[];
  public GuildId?: string;
  public Status?: string;
  public Activities?: Activity[];
  public ClientStatus?: IDiscordClientStatus;
  public Game?: Activity;

  constructor(Client: DiscordClient, PresenceObject: IDiscordPresenceUpdate) {
    this.User = { id: PresenceObject.user.id }
    if (PresenceObject.guild_id) {
      // good we got a starting point
      Client.Guilds.Fetch(PresenceObject.guild_id).then((AffectedGuild: Guild) => {
        if(AffectedGuild){
          AffectedGuild.Members.Fetch(PresenceObject.user.id).then((AffectedMember: GuildMember) => {
            this.User = AffectedMember.User;
          }).catch((err: Error) => {
            Client.logger.write().error({
              message: err,
              service: "User.Presence"
            })
          });
        }
      }).catch((err: Error) => {
        Client.logger.write().error({
          message: err,
          service: "User.Presence"
        })
      });
    }
    this.Roles = PresenceObject.roles;
    this.Status = PresenceObject.status;
    this.ClientStatus = PresenceObject.client_status;
    if (PresenceObject.game) {
      this.Game = new Activity(PresenceObject.game);
    }
    this.Activities = [];
    if (PresenceObject.activities) {
      for (const activity of PresenceObject.activities) {
        this.Activities.push(new Activity(activity));
      }
    }
  }
}
