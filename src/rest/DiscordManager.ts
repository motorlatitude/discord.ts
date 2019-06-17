//Node Modules
import * as events from 'events';

//NPM Modules

//Others
import DiscordRequester from './DiscordRequester';
import DiscordMethods from './DiscordMethods';

//Types
import { DiscordClientOptions } from './../common/types';

export default class DiscordManager {
  Requester: DiscordRequester;

  constructor(token: string) {
    this.Requester = new DiscordRequester(token);
  }

  Methods(): DiscordMethods {
    return new DiscordMethods(this.Requester);
  }
}
