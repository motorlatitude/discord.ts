import { IDiscordGuild, IDiscordHTTPResponse } from '../../../common/types';
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
  public Channels(): GuildChannelActions {
    return new GuildChannelActions(this.Client, this.Guild);
  }

  /**
   * Carry out member actions on this guild
   */
  public Members(): GuildMemberActions {
    return new GuildMemberActions(this.Client, this.Guild);
  }

  /**
   * Carry out user actions on this guild
   */
  public Users(): GuildUserActions {
    return new GuildUserActions(this.Client, this.Guild);
  }

  /**
   * Carry out ban actions on this guild
   */
  public Bans(): GuildBanActions {
    return new GuildBanActions(this.Client, this.Guild);
  }

  /**
   * Carry out role actions on this guild
   */
  public Roles(): GuildRoleActions {
    return new GuildRoleActions(this.Client, this.Guild);
  }

  /**
   * Carry out prune actions on this guild
   */
  public Prune(): GuildPruneActions {
    return new GuildPruneActions(this.Client, this.Guild);
  }

  /**
   * Carry out voice region actions on this guild
   */
  public VoiceRegions(): GuildVoiceRegionActions {
    return new GuildVoiceRegionActions(this.Client, this.Guild);
  }

  /**
   * Carry out voice region actions on this guild
   */
  public Invites(): GuildInviteActions {
    return new GuildInviteActions(this.Client, this.Guild);
  }

  /**
   * Carry out guild integration actions on this guild
   */
  public Integrations(): GuildIntegrationActions {
    return new GuildIntegrationActions(this.Client, this.Guild);
  }

  /**
   * Carry out embed actions on this guild
   */
  public Embed(): GuildEmbedActions {
    return new GuildEmbedActions(this.Client, this.Guild);
  }

  /**
   * Carry out vanity url actions on this guild
   */
  public VanityURL(): GuildVanityURLActions {
    return new GuildVanityURLActions(this.Client, this.Guild);
  }

  /**
   * Carry out audit actions on this guild
   */
  public Audit(): GuildAuditActions {
    return new GuildAuditActions(this.Client, this.Guild);
  }

  /**
   * Modify this guild, this will call the API
   * @param Parameters - parameters to alter https://discordapp.com/developers/docs/resources/guild#modify-guild-json-params
   */
  public Modify(Parameters: any): Promise<IDiscordGuild> {
    return new Promise((resolve, reject) => {
      this.Endpoint.ModifyGuild(this.Guild.id, Parameters)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Deletes this guild, this will call the API
   */
  public Delete(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.DeleteGuild(this.Guild.id)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
