import DiscordRequester from './DiscordRequester';
import ChannelsMethods from './Methods/ChannelsMethods';
import GatewayMethods from './Methods/GatewayMethods';
export default class DiscordMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    GatewayMethods(): GatewayMethods;
    channels(): ChannelsMethods;
}
