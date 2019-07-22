import DiscordRequester from './DiscordRequester';
import AuditMethods from './Methods/AuditMethods';
import ChannelsMethods from './Methods/ChannelsMethods';
import GatewayMethods from './Methods/GatewayMethods';
import GuildMethods from './Methods/GuildMethods';
export default class DiscordMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    GatewayMethods(): GatewayMethods;
    ChannelMethods(): ChannelsMethods;
    GuildMethods(): GuildMethods;
    AuditMethods(): AuditMethods;
}
