import {
  IDiscordGuildMemberAddGatewayEvent,
  IDiscordGuildMemberRemoveGatewayEvent,
  IDiscordGuildMembersChunkGatewayEvent,
  IDiscordGuildMemberUpdateGatewayEvent,
  IGuildMemberEventObject,
  IGuildMembersChunkEventObject,
} from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildMemberEvent extends ClientDispatcherEvent {
  public EventName?: 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_UPDATE' | 'GUILD_MEMBER_REMOVE' | 'GUILD_MEMBERS_CHUNK';
  public EventObject?: IGuildMemberEventObject;

  public EventChunkObject?: IGuildMembersChunkEventObject;

  /**
   * Constructor
   * @param client - Discord Client
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Handles GUILD_MEMBER_ADD event
   * @param Message - Message Data for the event
   */
  public HandleMemberAdd(Message: IDiscordGuildMemberAddGatewayEvent): void {
    this.Client.Guilds.Fetch(Message.guild_id)
      .then((AffectedGuild: Guild) => {
        const NewGuildMember = new GuildMember(Message);
        AffectedGuild.Members.AddGuildMember(NewGuildMember);

        this.EventName = 'GUILD_MEMBER_ADD';

        this.EventObject = {
          Guild: AffectedGuild,
          GuildMember: NewGuildMember,
        };

        this.Handle();
      })
      .catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
        });
      });
  }

  /**
   * Handles GUILD_MEMBER_REMOVE event
   * @param Message - Message Data for the event
   */
  public HandleMemberRemove(Message: IDiscordGuildMemberRemoveGatewayEvent): void {
    this.Client.Guilds.Fetch(Message.guild_id)
      .then((AffectedGuild: Guild) => {
        AffectedGuild.Members.Fetch(Message.user.id)
          .then((AffectedMember: GuildMember) => {
            AffectedGuild.Members.RemoveGuildMember(Message.user.id);

            this.EventName = 'GUILD_MEMBER_REMOVE';

            this.EventObject = {
              Guild: AffectedGuild,
              GuildMember: AffectedMember,
            };

            this.Handle();
          })
          .catch((err: Error) => {
            this.Client.logger.write().error({
              message: err,
              service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
            });
          });
      })
      .catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
        });
      });
  }

  /**
   * Handles GUILD_MEMBER_UPDATE event
   * @param Message - Message Data for the event
   */
  public HandleMemberUpdate(Message: IDiscordGuildMemberUpdateGatewayEvent): void {
    this.Client.Guilds.Fetch(Message.guild_id)
      .then((AffectedGuild: Guild) => {
        AffectedGuild.Members.Fetch(Message.user.id)
          .then((AffectedMember: GuildMember) => {
            AffectedMember.Roles = Message.roles;
            AffectedMember.User = new User(Message.user);
            AffectedMember.Nick = Message.nick;

            this.EventName = 'GUILD_MEMBER_UPDATE';

            this.EventObject = {
              Guild: AffectedGuild,
              GuildMember: AffectedMember,
            };

            this.Handle();
          })
          .catch((err: Error) => {
            this.Client.logger.write().error({
              message: err,
              service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberUpdate',
            });
          });
      })
      .catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberUpdate',
        });
      });
  }

  /**
   * Handles GUILD_MEMBERS_CHUNK
   * Sent in response to Guild Request Members.
   * @param Message - Message Data for the event
   */
  public HandleMemberChunk(Message: IDiscordGuildMembersChunkGatewayEvent): void {
    this.Client.Guilds.Fetch(Message.guild_id)
      .then((AffectedGuild: Guild) => {
        const EventMemberList: GuildMember[] = [];

        for (const member of Message.members) {
          const NewMember = new GuildMember(member);
          AffectedGuild.Members.UpdateGuildMember(member.user.id, NewMember);
          EventMemberList.push(NewMember);
        }

        this.EventChunkObject = {
          Guild: AffectedGuild,
          GuildMembers: EventMemberList,
        };

        this.Handle();
      })
      .catch((err: Error) => {
        this.Client.logger.write().error({
          message: err,
          service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberChunk',
        });
      });
  }

  public EmitEvent(): void {
    if (
      this.EventName === 'GUILD_MEMBER_ADD' ||
      this.EventName === 'GUILD_MEMBER_REMOVE' ||
      this.EventName === 'GUILD_MEMBER_UPDATE'
    ) {
      if (this.EventObject) {
        this.Client.emit(this.EventName, this.EventObject);
      }
    } else if (this.EventName === 'GUILD_MEMBERS_CHUNK') {
      if (this.EventChunkObject) {
        this.Client.emit(this.EventName, this.EventChunkObject);
      }
    }
  }
}
