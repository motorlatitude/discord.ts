import {
  IDiscordGuildMemberAddGatewayEvent,
  IDiscordGuildMemberRemoveGatewayEvent,
  IDiscordGuildMembersChunkGatewayEvent,
  IDiscordGuildMemberUpdateGatewayEvent,
} from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildMemberEvent extends ClientDispatcherEvent {
  public EventName?: 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_UPDATE' | 'GUILD_MEMBER_REMOVE' | 'GUILD_MEMBERS_CHUNK';
  public EventGuildObject?: Guild;
  public EventGuildMemberObject?: GuildMember;

  public EventGuildMemberChunkObject?: GuildMember[];

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
  public HandleMemberAdd(
    Message: IDiscordGuildMemberAddGatewayEvent,
  ): Promise<{ Guild: Guild; GuildMember: GuildMember }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(Message.guild_id)
        .then((AffectedGuild: Guild) => {
          const NewGuildMember = new GuildMember(Message);
          AffectedGuild.Members.AddGuildMember(NewGuildMember);
          AffectedGuild.MemberCount++;

          this.EventName = 'GUILD_MEMBER_ADD';

          this.EventGuildObject = AffectedGuild;
          this.EventGuildMemberObject = NewGuildMember;

          this.Handle();
          resolve({
            Guild: this.EventGuildObject,
            GuildMember: this.EventGuildMemberObject,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Handles GUILD_MEMBER_REMOVE event
   * @param Message - Message Data for the event
   */
  public HandleMemberRemove(
    Message: IDiscordGuildMemberRemoveGatewayEvent,
  ): Promise<{ Guild: Guild; GuildMember: GuildMember }> {
    return new Promise((resolve, reject) => {
      let AffectedGuild: Guild;
      this.Client.Guilds.Fetch(Message.guild_id)
        .then((FoundGuild: Guild) => {
          AffectedGuild = FoundGuild;
          return AffectedGuild.Members.Fetch(Message.user.id);
        })
        .then((AffectedMember: GuildMember) => {
          AffectedGuild.Members.RemoveGuildMember(Message.user.id);
          AffectedGuild.MemberCount--;

          this.EventName = 'GUILD_MEMBER_REMOVE';

          this.EventGuildObject = AffectedGuild;
          this.EventGuildMemberObject = AffectedMember;

          this.Handle();
          resolve({
            Guild: AffectedGuild,
            GuildMember: AffectedMember,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Handles GUILD_MEMBER_UPDATE event
   * @param Message - Message Data for the event
   */
  public HandleMemberUpdate(
    Message: IDiscordGuildMemberUpdateGatewayEvent,
  ): Promise<{ Guild: Guild; GuildMember: GuildMember }> {
    return new Promise((resolve, reject) => {
      let AffectedGuild: Guild;
      this.Client.Guilds.Fetch(Message.guild_id)
        .then((FoundGuild: Guild) => {
          AffectedGuild = FoundGuild;
          return AffectedGuild.Members.Fetch(Message.user.id);
        })
        .then((AffectedMember: GuildMember) => {
          AffectedMember.Roles = Message.roles;
          AffectedMember.User = new User(Message.user);
          AffectedMember.Nick = Message.nick;

          this.EventName = 'GUILD_MEMBER_UPDATE';

          this.EventGuildObject = AffectedGuild;
          this.EventGuildMemberObject = AffectedMember;

          this.Handle();
          resolve({
            Guild: AffectedGuild,
            GuildMember: this.EventGuildMemberObject,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * Handles GUILD_MEMBERS_CHUNK
   * Sent in response to Guild Request Members.
   * @param Message - Message Data for the event
   */
  public HandleMembersChunk(
    Message: IDiscordGuildMembersChunkGatewayEvent,
  ): Promise<{ Guild: Guild; GuildMembers: GuildMember[] }> {
    return new Promise((resolve, reject) => {
      this.Client.Guilds.Fetch(Message.guild_id)
        .then((AffectedGuild: Guild) => {
          const EventMemberList: GuildMember[] = [];

          for (const member of Message.members) {
            const NewMember = new GuildMember(member);
            AffectedGuild.Members.UpdateGuildMember(member.user.id, NewMember);
            EventMemberList.push(NewMember);
          }
          AffectedGuild.MemberCount = AffectedGuild.Members.Length();
          this.EventName = 'GUILD_MEMBERS_CHUNK';

          this.EventGuildObject = AffectedGuild;
          this.EventGuildMemberChunkObject = EventMemberList;

          this.Handle();
          resolve({
            Guild: AffectedGuild,
            GuildMembers: EventMemberList,
          });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  public EmitEvent(): void {
    if (
      this.EventName === 'GUILD_MEMBER_ADD' ||
      this.EventName === 'GUILD_MEMBER_REMOVE' ||
      this.EventName === 'GUILD_MEMBER_UPDATE'
    ) {
      if (this.EventGuildObject && this.EventGuildMemberObject) {
        this.Client.emit(this.EventName, this.EventGuildObject, this.EventGuildMemberObject);
      }
    } else if (this.EventName === 'GUILD_MEMBERS_CHUNK') {
      if (this.EventGuildObject && this.EventGuildMemberChunkObject) {
        this.Client.emit(this.EventName, this.EventGuildObject, this.EventGuildMemberChunkObject);
      }
    }
  }
}
