import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import GuildEvent from '../../../client/Events/GuildEvent';
import { IGuildDeleteEventObject } from '../../../common/types';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import Guild from '../../../resources/Guild/Guild';

describe('GuildEvent Handling', () => {

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

  it('HandleCreate: Should Send GUILD_CREATE event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_CREATE", (AffectedGuild: Guild) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildEvent(ClientInstance);
    await instance.HandleCreate({
      afk_timeout: 0,
      channels: [{
        guild_id: "GUILD_ID_TWO",
        id: "CHANNEL_ID_ONE",
        type: 0 // GUILD_TEXT
      },
        {
          guild_id: "GUILD_ID_TWO",
          id: "CHANNEL_ID_TWO",
          type: 2 // GUILD_VOICE
        },
        {
          guild_id: "GUILD_ID_TWO",
          id: "CHANNEL_ID_THREE",
          type: 4 // GUILD_CATEGORY
        }],
      default_message_notifications: 0,
      emojis: [],
      explicit_content_filter: 0,
      features: [],
      id: "GUILD_ID_TWO",
      max_members: 0,
      mfa_level: 0,
      name: "GUILD_NAME",
      owner_id: "OWNER_ID",
      premium_tier: 0,
      region: "eu-west",
      roles: [],
      verification_level: 0
    })
  });

  it('HandleUpdate: Should Send GUILD_UPDATE event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_UPDATE", (AffectedGuild: Guild) => {
      expect(AffectedGuild).toBeInstanceOf(Guild);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildEvent(ClientInstance);
    await instance.HandleUpdate({
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
    })
  });

  it('HandleDelete: Should Send GUILD_DELETE event with correct types', async (done) => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, "Handle");

    ClientInstance.on("GUILD_DELETE", (AffectedGuild: IGuildDeleteEventObject) => {
      expect(AffectedGuild.id).toEqual("GUILD_ID");
      expect(AffectedGuild.WasRemoved).toEqual(true);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new GuildEvent(ClientInstance);
    await instance.HandleDelete({
      id: "GUILD_ID",
      unavailable: undefined
    })
  });
  
});