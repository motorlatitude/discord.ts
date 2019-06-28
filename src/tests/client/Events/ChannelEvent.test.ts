import ChannelEvent from '../../../client/Events/ChannelEvent';
import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Guild from '../../../resources/Guild/Guild';
import ChannelStore from '../../../stores/ChannelStore';

describe('ChannelEvent CHANNEL_CREATE handling', () => {

  let ClientInstance: DiscordClient;

  beforeEach(() => {
    ClientInstance = new DiscordClient({token: "DISCORD_TOKEN"});
    // populate store with dummy guild
    ClientInstance.Guilds.AddGuild(new Guild(ClientInstance, {
      afk_timeout: 0,
      default_message_notifications: 0,
      emojis: [],
      explicit_content_filter: 0,
      features: [],
      id: "GUILD_ID",
      max_members: 0,
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

  it('Should create a new instance', () => {
    const instance = new ChannelEvent(ClientInstance, {
      id: "CHANNEL_ID",
      type: 0,
    });
    expect(instance).toBeInstanceOf(ChannelEvent);
  });

  it('Should add a new DM channel to the channel store, should call super.handle once done', () => {
    const spy = jest.spyOn(ChannelStore.prototype, "AddDMChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new ChannelEvent(ClientInstance, {
      id: "CHANNEL_ID",
      type: 1 // DM
    });
    instance.HandleCreate();
    expect(spy).toHaveBeenCalled();
    expect(spyHandle).toHaveBeenCalled();
  });

  it('Should add a new text channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_CREATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "AddTextChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_CREATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID",
      type: 0 // GUILD_TEXT
    });
    instance.HandleCreate();
  });


  it('Should add a new voice channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_CREATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "AddVoiceChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_CREATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID",
      type: 2 // GUILD_VOICE
    });
    instance.HandleCreate();
  });


  it('Should add a new category channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_CREATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "AddChannelCategory");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_CREATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID",
      type: 4 // GUILD_CATEGORY
    });
    instance.HandleCreate();
  });
});


describe('ChannelEvent CHANNEL_UPDATE handling', () => {

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

  it('Should Replace DMChannel, should call super.handle when done', () => {
    const spy = jest.spyOn(ChannelStore.prototype, "ReplaceChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    const instance = new ChannelEvent(ClientInstance, {
      id: "CHANNEL_ID",
      type: 1 // DM
    });
    instance.HandleUpdate();
    expect(spy).toHaveBeenCalled();
    expect(spyHandle).toHaveBeenCalled();
  });

  it('Should replace text channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_UPDATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "ReplaceChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_UPDATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID_ONE",
      type: 0 // GUILD_TEXT
    });
    instance.HandleUpdate();
  });

  it('Should replace voice channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_UPDATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "ReplaceChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_UPDATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID_TWO",
      type: 2 // GUILD_VOICE
    });
    instance.HandleUpdate();
  });

  it('Should replace category channel to the guilds channel store, should call super.handle and go on to emit CHANNEL_UPDATE event', async (done) => {
    const spy = jest.spyOn(ChannelStore.prototype, "ReplaceChannel");
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("CHANNEL_UPDATE", () => {
      expect(spyHandle).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      done();
    });

    const instance = new ChannelEvent(ClientInstance, {
      guild_id: "GUILD_ID",
      id: "CHANNEL_ID_THREE",
      type: 4 // GUILD_CATEGORY
    });
    instance.HandleUpdate();
  });
});