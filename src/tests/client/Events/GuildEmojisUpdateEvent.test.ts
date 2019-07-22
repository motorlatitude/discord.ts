import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import GuildEmojisUpdateEvent from '../../../client/Events/GuildEmojisUpdateEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Emoji from '../../../resources/Guild/Emoji';
import Guild from '../../../resources/Guild/Guild';

describe('GuildEmojisUpdateEvent Handling', () => {
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

  it('Handle: Should Send GUILD_EMOJIS_UPDATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('GUILD_EMOJIS_UPDATE', (AffectedGuild: Guild, Emojis: Emoji[]) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(Emojis[0]).toBeInstanceOf(Emoji);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildEmojisUpdateEvent(ClientInstance, {
      emojis: [
        {
          id: 'EMOJI_ID',
          name: '👋',
        },
      ],
      guild_id: 'GUILD_ID',
    });
    await instance.Handle();
  });

  it('Handle: Should reject if invalid GUILD_ID passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new GuildEmojisUpdateEvent(ClientInstance, {
      emojis: [
        {
          id: 'EMOJI_ID',
          name: '👋',
        },
      ],
      guild_id: 'INVALID_GUILD_ID',
    });
    await expect(instance.Handle()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });
});
