import { IDiscordGuildRoleEvent, IGuildRoleEventObject } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import Role from '../../resources/Guild/Role';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildRoleEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildRoleEvent;

  public EventName?: 'GUILD_ROLE_CREATE' | 'GUILD_ROLE_UPDATE' | 'GUILD_ROLE_DELETE';
  public EventObject?: IGuildRoleEventObject;

  constructor(client: DiscordClient, msg: IDiscordGuildRoleEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles GUILD_ROLE_CREATE event
   */
  public HandleRoleCreate(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id)
      .then((AffectedGuild: Guild) => {
        if (this.Message.role) {
          const role = new Role(this.Message.role);
          AffectedGuild.Roles.AddRole(role);

          this.EventName = 'GUILD_ROLE_CREATE';
          this.EventObject = {
            Guild: AffectedGuild,
            Role: role,
          };

          this.Handle();
        } else {
          // Shouldn't happen
          this.Client.logger.write().warn({
            message: 'We got a GUILD_ROLE_CREATE event but no role was supplied',
            service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleCreate',
          });
        }
      })
      .catch((err: Error) => {
        this.Client.logger.write().warn({
          message: err,
          service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleCreate',
        });
      });
  }

  /**
   * Handles GUILD_ROLE_UPDATE event
   */
  public HandleRoleUpdate(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id)
      .then((AffectedGuild: Guild) => {
        if (this.Message.role) {
          const UpdatedRole = new Role(this.Message.role);
          AffectedGuild.Roles.UpdateRole(this.Message.role.id, UpdatedRole);

          this.EventName = 'GUILD_ROLE_UPDATE';
          this.EventObject = {
            Guild: AffectedGuild,
            Role: UpdatedRole,
          };

          this.Handle();
        } else {
          // Shouldn't happen
          this.Client.logger.write().warn({
            message: 'We got a GUILD_ROLE_UPDATE event but no role was supplied',
            service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleUpdate',
          });
        }
      })
      .catch((err: Error) => {
        this.Client.logger.write().warn({
          message: err,
          service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleUpdate',
        });
      });
  }

  /**
   * Handles GUILD_ROLE_DELETE event
   */
  public HandleRoleDelete(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id)
      .then((AffectedGuild: Guild) => {
        if (this.Message.role_id) {
          AffectedGuild.Roles.Fetch(this.Message.role_id)
            .then((AffectedRole: Role) => {
              AffectedGuild.Roles.RemoveRole(AffectedRole.id);

              this.EventName = 'GUILD_ROLE_DELETE';
              this.EventObject = {
                Guild: AffectedGuild,
                Role: AffectedRole,
              };

              this.Handle();
            })
            .catch((err: Error) => {
              this.Client.logger.write().warn({
                message: err,
                service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
              });
            });
        } else {
          // Shouldn't happen
          this.Client.logger.write().warn({
            message: 'We got a GUILD_ROLE_DELETE event but no role_id was supplied',
            service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
          });
        }
      })
      .catch((err: Error) => {
        this.Client.logger.write().warn({
          message: err,
          service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
        });
      });
  }

  public EmitEvent(): void {
    if (this.EventName && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }
}
