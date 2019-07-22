import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import GuildRoleEvent from '../../../client/Events/GuildRoleEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Guild from '../../../resources/Guild/Guild';
import Role from '../../../resources/Guild/Role';

describe('GuildRoleEvent Handling', () => {
  let ClientInstance: DiscordClient;

  beforeEach(() => {
    ClientInstance = new DiscordClient({ token: 'DISCORD_TOKEN' });
    // populate channel store with dummy channel
    ClientInstance.Channels.AddDMChannel(
      new DirectMessageChannel(ClientInstance, {
        id: 'CHANNEL_ID',
        type: 1,
      }),
    );
    // populate store with dummy guild
    ClientInstance.Guilds.AddGuild(
      new Guild(ClientInstance, {
        afk_timeout: 0,
        channels: [
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_ONE',
            type: 0, // GUILD_TEXT
          },
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_TWO',
            type: 2, // GUILD_VOICE
          },
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_THREE',
            type: 4, // GUILD_CATEGORY
          },
        ],
        default_message_notifications: 0,
        emojis: [],
        explicit_content_filter: 0,
        features: [],
        id: 'GUILD_ID',
        max_members: 0,
        members: [
          {
            deaf: false,
            joined_at: new Date().getTime(),
            mute: false,
            roles: ['ROLE_ID'],
            user: {
              avatar: 'AVATAR_STRING',
              discriminator: '1234',
              id: 'USER_ID',
              username: 'USERNAME',
            },
          },
        ],
        mfa_level: 0,
        name: 'GUILD_NAME',
        owner_id: 'OWNER_ID',
        premium_tier: 0,
        region: 'eu-west',
        roles: [
          {
            color: 0,
            hoist: false,
            id: 'ROLE_ID',
            managed: false,
            mentionable: true,
            name: 'ROLE_NAME',
            permissions: 0,
            position: 1,
          },
        ],
        verification_level: 0,
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('HandleRoleCreate: Should Send GUILD_ROLE_CREATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_ROLE_CREATE', (AffectedGuild: Guild, AffectedRole: Role) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedRole).toBeInstanceOf(Role);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role: {
        color: 0,
        hoist: false,
        id: 'ROLE_ID',
        managed: false,
        mentionable: true,
        name: 'ROLE_NAME',
        permissions: 0,
        position: 1,
      },
    });
    await instance.HandleRoleCreate();
  });

  it('HandleRoleCreate: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'INVALID_GUILD_ID',
      role: {
        color: 0,
        hoist: false,
        id: 'ROLE_ID',
        managed: false,
        mentionable: true,
        name: 'ROLE_NAME',
        permissions: 0,
        position: 1,
      },
    });
    await expect(instance.HandleRoleCreate()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleRoleCreate: Should reject if no role is passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role: undefined,
    });
    await expect(instance.HandleRoleCreate()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleRoleUpdate: Should Send GUILD_ROLE_UPDATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_ROLE_UPDATE', (AffectedGuild: Guild, AffectedRole: Role) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedRole).toBeInstanceOf(Role);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role: {
        color: 0,
        hoist: false,
        id: 'ROLE_ID',
        managed: false,
        mentionable: true,
        name: 'ROLE_NAME',
        permissions: 0,
        position: 1,
      },
    });
    await instance.HandleRoleUpdate();
  });

  it('HandleRoleUpdate: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'INVALID_GUILD_ID',
      role: {
        color: 0,
        hoist: false,
        id: 'ROLE_ID',
        managed: false,
        mentionable: true,
        name: 'ROLE_NAME',
        permissions: 0,
        position: 1,
      },
    });
    await expect(instance.HandleRoleUpdate()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleRoleUpdate: Should reject if no role is passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role: undefined,
    });
    await expect(instance.HandleRoleUpdate()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleRoleDelete: Should Send GUILD_ROLE_DELETE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_ROLE_DELETE', (AffectedGuild: Guild, AffectedRole: Role) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedRole).toBeInstanceOf(Role);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role_id: 'ROLE_ID',
    });
    await instance.HandleRoleDelete();
  });

  it('HandleRoleDelete: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'INVALID_GUILD_ID',
      role_id: 'ROLE_ID',
    });
    await expect(instance.HandleRoleDelete()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleRoleDelete: Should reject if invalid ROLE_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildRoleEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      role_id: 'INVALID_ROLE_ID',
    });
    await expect(instance.HandleRoleDelete()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });
});
