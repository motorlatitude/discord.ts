import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import MessageStore from '../../stores/MessageStore';
import Channel from './Channel';
export default class DirectMessageChannel extends Channel {
    Name: string;
    Recipients: any[];
    Icon: string;
    OwnerId: string;
    Messages: MessageStore;
    LastMessageId: string | undefined;
    ApplicationId: string | undefined;
    LastPinTimestamp: number | undefined;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
}
