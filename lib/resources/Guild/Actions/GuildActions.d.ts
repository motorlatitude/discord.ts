import { IDiscordGuild } from '../../../common/types';
import GuildAction from './GuildAction';
import GuildAuditActions from './GuildAuditActions';
import GuildBanActions from './GuildBanActions';
import GuildChannelActions from './GuildChannelActions';
import GuildEmbedActions from './GuildEmbedActions';
import GuildIntegrationActions from './GuildIntegrationActions';
import GuildInviteActions from './GuildInviteActions';
import GuildMemberActions from './GuildMemberActions';
import GuildPruneActions from './GuildPruneActions';
import GuildRoleActions from './GuildRoleActions';
import GuildUserActions from './GuildUserActions';
import GuildVanityURLActions from './GuildVanityURLActions';
import GuildVoiceRegionActions from './GuildVoiceRegionActions';
export default class GuildActions extends GuildAction {
    /**
     * Carry out channel actions on this guild
     */
    Channels(): GuildChannelActions;
    /**
     * Carry out member actions on this guild
     */
    Members(): GuildMemberActions;
    /**
     * Carry out user actions on this guild
     */
    Users(): GuildUserActions;
    /**
     * Carry out ban actions on this guild
     */
    Bans(): GuildBanActions;
    /**
     * Carry out role actions on this guild
     */
    Roles(): GuildRoleActions;
    /**
     * Carry out prune actions on this guild
     */
    Prune(): GuildPruneActions;
    /**
     * Carry out voice region actions on this guild
     */
    VoiceRegions(): GuildVoiceRegionActions;
    /**
     * Carry out voice region actions on this guild
     */
    Invites(): GuildInviteActions;
    /**
     * Carry out guild integration actions on this guild
     */
    Integrations(): GuildIntegrationActions;
    /**
     * Carry out embed actions on this guild
     */
    Embed(): GuildEmbedActions;
    /**
     * Carry out vanity url actions on this guild
     */
    VanityURL(): GuildVanityURLActions;
    /**
     * Carry out audit actions on this guild
     */
    Audit(): GuildAuditActions;
    /**
     * Modify this guild, this will call the API
     * @param Parameters - parameters to alter https://discordapp.com/developers/docs/resources/guild#modify-guild-json-params
     */
    Modify(Parameters: any): Promise<IDiscordGuild>;
    /**
     * Deletes this guild, this will call the API
     */
    Delete(): Promise<undefined>;
}
