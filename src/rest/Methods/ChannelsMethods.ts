import DiscordRequester from '../DiscordRequester';

export default class ChannelsMethods {
  Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  createMessage(content: string, channel_id: string, options: any) {}
}
