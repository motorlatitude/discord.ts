import DiscordRequester from './DiscordRequester';
import AuditMethods from './Methods/AuditMethods';
import ChannelsMethods from './Methods/ChannelsMethods';
import GatewayMethods from './Methods/GatewayMethods';
import GuildMethods from './Methods/GuildMethods';

export default class DiscordMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  public GatewayMethods(): GatewayMethods {
    return new GatewayMethods(this.Requester);
  }

  public ChannelMethods(): ChannelsMethods {
    return new ChannelsMethods(this.Requester);
  }

  public GuildMethods(): GuildMethods {
    return new GuildMethods(this.Requester);
  }

  public AuditMethods(): AuditMethods {
    return new AuditMethods(this.Requester);
  }
}
