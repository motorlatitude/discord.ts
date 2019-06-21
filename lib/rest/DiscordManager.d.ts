import DiscordMethods from './DiscordMethods';
import DiscordRequester from './DiscordRequester';
export default class DiscordManager {
    Requester: DiscordRequester;
    constructor(token: string);
    Methods(): DiscordMethods;
}
