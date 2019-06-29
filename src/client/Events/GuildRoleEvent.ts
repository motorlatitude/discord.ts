import { IDiscordGuildRoleEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import Role from '../../resources/Guild/Role';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildRoleEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildRoleEvent;

  public EventName?: 'GUILD_ROLE_CREATE' | 'GUILD_ROLE_UPDATE' | 'GUILD_ROLE_DELETE';
  public EventGuildObject?: Guild;
  public EventRoleObject?: Role;

  constructor(client: DiscordClient, msg: IDiscordGuildRoleEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles GUILD_ROLE_CREATE event
   */
  public HandleRoleCreate(): Promise<{ Guild: Guild; Role: Role }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          if (this.Message.role) {
            const role = new Role(this.Message.role);
            AffectedGuild.Roles.AddRole(role);

            this.EventName = 'GUILD_ROLE_CREATE';
            this.EventGuildObject = AffectedGuild;
            this.EventRoleObject = role;

            this.Handle();
            resolve({
              Guild: AffectedGuild,
              Role: role,
            });
          } else {
            // Shouldn't happen
            reject(new Error('We got a GUILD_ROLE_CREATE event but no role was supplied'));
          }
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Handles GUILD_ROLE_UPDATE event
   */
  public HandleRoleUpdate(): Promise<{ Guild: Guild; Role: Role }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((AffectedGuild: Guild) => {
          if (this.Message.role) {
            const UpdatedRole = new Role(this.Message.role);
            AffectedGuild.Roles.UpdateRole(this.Message.role.id, UpdatedRole);

            this.EventName = 'GUILD_ROLE_UPDATE';
            this.EventGuildObject = AffectedGuild;
            this.EventRoleObject = UpdatedRole;

            this.Handle();
            resolve({
              Guild: AffectedGuild,
              Role: UpdatedRole,
            });
          } else {
            // Shouldn't happen
            reject(new Error('We got a GUILD_ROLE_UPDATE event but no role was supplied'));
          }
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Handles GUILD_ROLE_DELETE event
   */
  public HandleRoleDelete(): Promise<{ Guild: Guild; Role: Role }> {
    return new Promise((resolve, reject) => {
      let AffectedGuild: Guild;
      this.Client.Guilds.Fetch(this.Message.guild_id)
        .then((FoundGuild: Guild) => {
          AffectedGuild = FoundGuild;
          return AffectedGuild.Roles.Fetch(this.Message.role_id as string);
        })
        .then((AffectedRole: Role) => {
          AffectedGuild.Roles.RemoveRole(AffectedRole.id);

          this.EventName = 'GUILD_ROLE_DELETE';
          this.EventGuildObject = AffectedGuild;
          this.EventRoleObject = AffectedRole;

          this.Handle();
          resolve({
            Guild: AffectedGuild,
            Role: AffectedRole,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  public EmitEvent(): void {
    if (this.EventName && this.EventGuildObject && this.EventRoleObject) {
      this.Client.emit(this.EventName, this.EventGuildObject, this.EventRoleObject);
    }
  }
}
