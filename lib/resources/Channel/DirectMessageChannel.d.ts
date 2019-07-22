import { IDiscordChannel } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import UserStore from '../../stores/UserStore';
import TextBasedChannel from './TextBasedChannel';
export default class DirectMessageChannel extends TextBasedChannel {
    Recipients: UserStore;
    Icon: string;
    OwnerId: string;
    constructor(Client: DiscordClient, ChannelObject: IDiscordChannel);
    private ResolveRecipients;
}
