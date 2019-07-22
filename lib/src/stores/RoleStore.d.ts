import DiscordClient from '../DiscordClient';
import Role from '../resources/Guild/Role';
import Store from './Store';
export default class RoleStore extends Store {
    constructor(client: DiscordClient);
    /**
     * Add a new role to the store
     * @param RoleObject - A Role
     */
    AddRole(RoleObject: Role): void;
    /**
     * Replace an existing role in the store
     * @param RoleId - id of role to replace
     * @param RoleObject - the role to replace it with
     */
    ReplaceRole(RoleId: string, RoleObject: Role): void;
    /**
     * Replace an existing role if it exists or add a new one if it doesn't
     * @param RoleId - id of the role to replace
     * @param RoleObject - the role to replace it with or to add
     */
    UpdateRole(RoleId: string, RoleObject: Role): void;
    RemoveRole(RoleId: string): void;
    /**
     * Fetch role for role id
     * @param RoleId - id of role
     */
    Fetch(RoleId: string): Promise<Role>;
}
