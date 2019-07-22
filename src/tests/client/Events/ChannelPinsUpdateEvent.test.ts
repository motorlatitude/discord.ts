import ChannelPinsUpdateEvent from '../../../client/Events/ChannelPinsUpdateEvent';
import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../../resources/Channel/TextChannel';
import Guild from '../../../resources/Guild/Guild';

describe('ChannelPinsUpdateEvent CHANNEL_PINS_UPDATE handling', () => {
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

  it('Should Send CHANNEL_PINS_UPDATE event with correct types for Guild Text Channels', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('CHANNEL_PINS_UPDATE', EventObject => {
      expect(EventObject.Guild).toBeInstanceOf(Guild);
      expect(EventObject.Channel).toBeInstanceOf(TextChannel);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelPinsUpdateEvent(ClientInstance, {
      channel_id: 'CHANNEL_ID_ONE',
      guild_id: 'GUILD_ID',
      last_pin_timestamp: new Date().getTime(),
    });
    await instance.Handle();
  });

  it('Should not emit event and reject if invalid channel is passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new ChannelPinsUpdateEvent(ClientInstance, {
      channel_id: 'CHANNEL_ID_TWO',
      guild_id: 'GUILD_ID',
      last_pin_timestamp: new Date().getTime(),
    });
    await expect(instance.Handle()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toHaveBeenCalled();
    done();
  });

  it('Should not emit event and reject if unknown guild_id is passed', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new ChannelPinsUpdateEvent(ClientInstance, {
      channel_id: 'CHANNEL_ID',
      guild_id: 'UNKNOWN_GUILD_ID',
      last_pin_timestamp: new Date().getTime(),
    });
    await expect(instance.Handle()).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toHaveBeenCalled();
    done();
  });

  it('Should Send CHANNEL_PINS_UPDATE event with correct types for Direct Message Channel', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('CHANNEL_PINS_UPDATE', EventObject => {
      expect(EventObject.Channel).toBeInstanceOf(DirectMessageChannel);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelPinsUpdateEvent(ClientInstance, {
      channel_id: 'CHANNEL_ID',
      last_pin_timestamp: new Date().getTime(),
    });
    await instance.Handle();
  });
});
