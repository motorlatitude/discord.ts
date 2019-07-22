import { IDiscordChannel, IDiscordMessage } from '../../common/types';
import { IEndpointMessageDetailsObject } from '../../common/types/ChannelEndpoint.types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import Channel from './Channel';
export default class TextBasedChannel extends Channel {
    Name: string;
    Messages: MessageStore;
    LastMessageId: string | undefined;
    ApplicationId: string | undefined;
    LastPinTimestamp: number | undefined;
    constructor(client: DiscordClient, ChannelObject: IDiscordChannel);
    SendMessage(Content: string, MessageDetails: IEndpointMessageDetailsObject): Promise<IDiscordMessage>;
}
