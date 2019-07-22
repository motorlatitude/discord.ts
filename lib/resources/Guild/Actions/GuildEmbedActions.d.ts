import { IDiscordEmbed } from '../../../common/types';
import { IEndpointGuildEmbedObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildEmbedActions extends GuildAction {
    /**
     * Get this guilds embed
     */
    GetEmbed(): Promise<IDiscordEmbed>;
    /**
     * Modify the guild embed
     * @param NewGuildEmbed - the altered properties of the embed
     */
    ModifyEmbed(NewGuildEmbed: IEndpointGuildEmbedObject): Promise<IDiscordEmbed>;
}
