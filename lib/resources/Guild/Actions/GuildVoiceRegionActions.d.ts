import { IDiscordVoiceRegion } from '../../../common/types';
import GuildAction from './GuildAction';
export default class GuildVoiceRegionActions extends GuildAction {
    /**
     * List available voice regions for this server
     */
    GetVoiceRegions(): Promise<IDiscordVoiceRegion[]>;
}
