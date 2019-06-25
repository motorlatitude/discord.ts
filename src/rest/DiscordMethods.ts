import DiscordRequester from './DiscordRequester';

import ChannelsMethods from './Methods/ChannelsMethods';
import GatewayMethods from './Methods/GatewayMethods';

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
}
