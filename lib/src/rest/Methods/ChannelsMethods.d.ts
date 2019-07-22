import DiscordRequester from '../DiscordRequester';
export default class ChannelsMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    CreateMessage(Content: string, ChannelId: string): void;
}
