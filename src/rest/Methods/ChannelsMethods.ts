import DiscordRequester from '../DiscordRequester';

export default class ChannelsMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  public CreateMessage(Content: string, ChannelId: string) {
    this.Requester.SendRequest('POST', '/channels/' + ChannelId + '/messages', {
      content: Content,
    });
  }
}
