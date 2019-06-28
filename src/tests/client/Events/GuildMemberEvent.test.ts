import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import GuildMemberEvent from '../../../client/Events/GuildMemberEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Guild from '../../../resources/Guild/Guild';
import GuildMember from '../../../resources/Guild/GuildMember';

describe('GuildMemberEvent Handling', () => {

  let ClientInstance: DiscordClient;

  beforeEach(() => {
    ClientInstance = new DiscordClient({token: "DISCORD_TOKEN"});
    // populate channel store with dummy channel
    ClientInstance.Channels.AddDMChannel(new DirectMessageChannel(ClientInstance, {
      id: "CHANNEL_ID",
      type: 1
    }));
    // populate store with dummy guild
    ClientInstance.Guilds.AddGuild(new Guild(ClientInstance, {
      afk_timeout: 0,
      channels: [{
          guild_id: "GUILD_ID",
          id: "CHANNEL_ID_ONE",
          type: 0 // GUILD_TEXT
        },
        {
          guild_id: "GUILD_ID",
          id: "CHANNEL_ID_TWO",
          type: 2 // GUILD_VOICE
        },
        {
          guild_id: "GUILD_ID",
          id: "CHANNEL_ID_THREE",
          type: 4 // GUILD_CATEGORY
        }],
      default_message_notifications: 0,
      emojis: [],
      explicit_content_filter: 0,
      features: [],
      id: "GUILD_ID",
      max_members: 0,
      members: [{
        deaf: false,
        joined_at: new Date().getTime(),
        mute: false,
        roles: ["ROLE_ID"],
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      }],
      mfa_level: 0,
      name: "GUILD_NAME",
      owner_id: "OWNER_ID",
      premium_tier: 0,
      region: "eu-west",
      roles: [],
      verification_level: 0
    }))
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('HandleMemberAdd: Should Send GUILD_MEMBER_ADD event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_MEMBER_ADD", (AffectedGuild: Guild, AffectedGuildMember: GuildMember) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildMemberEvent(ClientInstance);
    await instance.HandleMemberAdd({
      deaf: false,
      guild_id: "GUILD_ID",
      joined_at: new Date().getTime(),
      mute: false,
      roles: ["ROLE_ID"],
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    })
  });

  it('HandleMemberAdd: Should reject if invalid GUILD_ID passed', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new GuildMemberEvent(ClientInstance);
    const InvalidMessage = {
      deaf: false,
      guild_id: "INVALID_GUILD_ID",
      joined_at: new Date().getTime(),
      mute: false,
      roles: ["ROLE_ID"],
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    };
    await expect(instance.HandleMemberAdd(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMemberUpdate: Should Send GUILD_MEMBER_UPDATE event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_MEMBER_UPDATE", (AffectedGuild: Guild, AffectedGuildMember: GuildMember) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
      expect(AffectedGuildMember.Nick).toEqual("USER_NICKNAME");
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildMemberEvent(ClientInstance);
    await instance.HandleMemberUpdate({
      guild_id: "GUILD_ID",
      nick: "USER_NICKNAME",
      roles: ["ROLE_ID"],
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    })
  });

  it('HandleMemberUpdate: Should reject if invalid GUILD_ID passed', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new GuildMemberEvent(ClientInstance);
    const InvalidMessage = {
      guild_id: "INVALID_GUILD_ID",
      nick: "USER_NICKNAME",
      roles: ["ROLE_ID"],
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    };
    await expect(instance.HandleMemberUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMemberRemove: Should Send GUILD_MEMBER_REMOVE event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_MEMBER_REMOVE", (AffectedGuild: Guild, AffectedGuildMember: GuildMember) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildMemberEvent(ClientInstance);
    await instance.HandleMemberRemove({
      guild_id: "GUILD_ID",
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    })
  });

  it('HandleMemberRemove: Should reject if invalid GUILD_ID passed', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new GuildMemberEvent(ClientInstance);
    const InvalidMessage = {
      guild_id: "INVALID_GUILD_ID",
      user: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      }
    };
    await expect(instance.HandleMemberRemove(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMembersChunk: Should Send GUILD_MEMBERS_CHUNK event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_MEMBERS_CHUNK", (AffectedGuild: Guild, AffectedGuildMembers: GuildMember[]) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedGuildMembers[0]).toBeInstanceOf(GuildMember);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildMemberEvent(ClientInstance);
    await instance.HandleMembersChunk({
      guild_id: "GUILD_ID",
      members: [ {
        deaf: false,
        joined_at: new Date().getTime(),
        mute: false,
        roles: ["ROLE_ID"],
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      }]
    })
  });

  it('HandleMembersChunk: Should reject if invalid GUILD_ID passed', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new GuildMemberEvent(ClientInstance);
    const InvalidMessage = {
      guild_id: "INVALID_GUILD_ID",
      members: [ {
        deaf: false,
        joined_at: new Date().getTime(),
        mute: false,
        roles: ["ROLE_ID"],
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      }]
    };
    await expect(instance.HandleMembersChunk(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });
});