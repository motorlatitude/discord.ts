import { IDiscordGuildEmojiUpdateGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Emoji from '../../resources/Guild/Emoji';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';
export default class GuildEmojisUpdateEvent extends ClientDispatcherEvent {
    readonly Message: IDiscordGuildEmojiUpdateGatewayEvent;
    readonly EventName: 'GUILD_EMOJIS_UPDATE';
    EventGuildObject?: Guild;
    EventEmojisObject?: Emoji[];
    constructor(client: DiscordClient, msg: IDiscordGuildEmojiUpdateGatewayEvent);
    Handle(): Promise<{
        Guild: Guild;
        Emojis: Emoji[];
    }>;
    EmitEvent(): void;
}
