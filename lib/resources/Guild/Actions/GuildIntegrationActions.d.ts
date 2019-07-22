import { IDiscordIntegration } from '../../../common/types';
import { IEndpointIntegrationObject, IEndpointModifyIntegrationObject } from '../../../common/types/GuildEndpoint.types';
import GuildAction from './GuildAction';
export default class GuildIntegrationActions extends GuildAction {
    /**
     * List a guilds integrations
     */
    GetIntegrations(): Promise<IDiscordIntegration[]>;
    /**
     * Attach an integration object from the current user to the guild
     * @param NewIntegrationObject - required object containing type and integration id
     */
    CreateIntegration(NewIntegrationObject: IEndpointIntegrationObject): Promise<undefined>;
    /**
     * Modify an existing integration in the guild
     * @param IntegrationId - the id of the integration to modify
     * @param IntegrationModifyObject - modify parameters, object containing expire_behaviour
     */
    ModifyIntegration(IntegrationId: string, IntegrationModifyObject: IEndpointModifyIntegrationObject): Promise<undefined>;
    /**
     * Delete an attached integration
     * @param IntegrationId - the id of the integration to delete
     */
    DeleteIntegration(IntegrationId: string): Promise<undefined>;
    /**
     * Sync an attached integration
     * @param IntegrationId - the id of integration to sync
     */
    SyncIntegration(IntegrationId: string): Promise<undefined>;
}
