import { IDiscordChannel } from '../../../common/types';
import { IEndpointChannelObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildChannelActions extends GuildAction {
    /**
     * Request Guild Channels, this will call the API
     */
    GetChannels(): Promise<IDiscordChannel[]>;
    /**
     * Create a new channel in this guild, this will call the API
     * @param NewChannelObject - the new channel object
     */
    CreateNewChannel(NewChannelObject: IEndpointChannelObject): Promise<IDiscordChannel>;
}
