import { IDiscordHTTPResponse, IDiscordIntegration } from '../../../common/types';
import {
  IEndpointIntegrationObject,
  IEndpointModifyIntegrationObject,
} from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';

export default class GuildIntegrationActions extends GuildAction {
  /**
   * List a guilds integrations
   */
  public GetIntegrations(): Promise<IDiscordIntegration[]> {
    return new Promise((resolve, reject) => {
      this.Endpoint.GetGuildIntegrations(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Attach an integration object from the current user to the guild
   * @param NewIntegrationObject - required object containing type and integration id
   */
  public CreateIntegration(NewIntegrationObject: IEndpointIntegrationObject): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.CreateGuildIntegration(this.Guild.id, NewIntegrationObject)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Modify an existing integration in the guild
   * @param IntegrationId - the id of the integration to modify
   * @param IntegrationModifyObject - modify parameters, object containing expire_behaviour
   */
  public ModifyIntegration(
    IntegrationId: string,
    IntegrationModifyObject: IEndpointModifyIntegrationObject,
  ): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.ModifyGuildIntegration(this.Guild.id, IntegrationId, IntegrationModifyObject)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Delete an attached integration
   * @param IntegrationId - the id of the integration to delete
   */
  public DeleteIntegration(IntegrationId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.DeleteGuildIntegration(this.Guild.id, IntegrationId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Sync an attached integration
   * @param IntegrationId - the id of integration to sync
   */
  public SyncIntegration(IntegrationId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Endpoint.SyncGuildIntegration(this.Guild.id, IntegrationId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
