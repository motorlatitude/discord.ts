import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import GuildBanEvent from '../../../client/Events/GuildBanEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Guild from '../../../resources/Guild/Guild';
import User from '../../../resources/User/User';

describe('GuildBanEvent Handling', () => {
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
        mfa_level: 0,
        name: 'GUILD_NAME',
        owner_id: 'OWNER_ID',
        premium_tier: 0,
        region: 'eu-west',
        roles: [],
        verification_level: 0,
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('HandleBanAdd: Should Send GUILD_BAN_ADD event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_BAN_ADD', (AffectedGuild: Guild, AffectedUser: User) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedUser).toBeInstanceOf(User);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildBanEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      user: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
    });
    await instance.HandleBanAdd();
  });

  it('HandleBanAdd: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildBanEvent(ClientInstance, {
      guild_id: 'INVALID_GUILD_ID',
      user: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
    });
    await expect(instance.HandleBanAdd()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleBanRemove: Should Send GUILD_BAN_REMOVE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_BAN_REMOVE', (AffectedGuild: Guild, AffectedUser: User) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(AffectedUser).toBeInstanceOf(User);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildBanEvent(ClientInstance, {
      guild_id: 'GUILD_ID',
      user: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
    });
    await instance.HandleBanRemove();
  });

  it('HandleBanRemove: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildBanEvent(ClientInstance, {
      guild_id: 'INVALID_GUILD_ID',
      user: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
    });
    await expect(instance.HandleBanRemove()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });
});
