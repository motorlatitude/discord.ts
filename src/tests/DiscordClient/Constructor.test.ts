import Logger from '../../common/Logger';
import DiscordClient from '../../DiscordClient'
import DiscordManager from '../../rest/DiscordManager';
import ChannelStore from '../../stores/ChannelStore';
import GuildStore from '../../stores/GuildStore';
import VoiceStateStore from '../../stores/VoiceStateStore';

/**
 * Tests Initialisation
 */
describe('DiscordClient Constructor', () => {
  let instance: DiscordClient;
  beforeEach(() => {
    // before
    instance = new DiscordClient({token: "DISCORD_TOKEN"})
  });

  it('should set token property', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.token).toBe("DISCORD_TOKEN");
  });
  
  it('should create a new logger instance', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.logger).toBeInstanceOf(Logger);
  });

  it('should create a new Channels property - ChannelStore instance', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.Channels).toBeInstanceOf(ChannelStore);
  });

  it('should create a new Guilds property - GuildStore instance', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.Guilds).toBeInstanceOf(GuildStore);
  });

  it('should create a new VoiceStates property - VoiceStateStore instance', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.VoiceStates).toBeInstanceOf(VoiceStateStore);
  });

  it('should create a new DiscordAPIManager property - DiscordManager instance', () => {
    expect(instance).toBeInstanceOf(DiscordClient);
    expect(instance.DiscordAPIManager).toBeInstanceOf(DiscordManager);
  });

});
