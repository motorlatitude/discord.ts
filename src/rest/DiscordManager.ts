// Node Modules
import * as events from 'events';

// NPM Modules

// Others
import DiscordMethods from './DiscordMethods';
import DiscordRequester from './DiscordRequester';

export default class DiscordManager {
  public Requester: DiscordRequester;

  constructor(token: string) {
    this.Requester = new DiscordRequester(token);
  }

  public Methods(): DiscordMethods {
    return new DiscordMethods(this.Requester);
  }
}
