import DiscordRequester from './DiscordRequester';

import ChannelsMethods from './Methods/ChannelsMethods';
import GatewayMethods from './Methods/GatewayMethods';

export default class DiscordMethods {
  Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  GatewayMethods(): GatewayMethods {
    return new GatewayMethods(this.Requester);
  }

  channels(): ChannelsMethods {
    return new ChannelsMethods(this.Requester);
  }
}
