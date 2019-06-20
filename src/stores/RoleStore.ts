import DiscordClient from '../DiscordClient';
import Role from '../resources/Guild/Role';
import Store from './Store';

export default class RoleStore extends Store {
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Add a new role to the store
   * @param RoleObject - A Role
   */
  public AddRole(RoleObject: Role): void {
    this.Add(RoleObject.id, RoleObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.RoleStore.AddRole.Store',
      });
    });
  }

  /**
   * Replace an existing role in the store
   * @param RoleId - id of role to replace
   * @param RoleObject - the role to replace it with
   */
  public ReplaceRole(RoleId: string, RoleObject: Role): void {
    this.Replace(RoleId, RoleObject).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.RoleStore.ReplaceRole.Store',
      });
    });
  }

  /**
   * Replace an existing role if it exists or add a new one if it doesn't
   * @param RoleId - id of the role to replace
   * @param RoleObject - the role to replace it with or to add
   */
  public UpdateRole(RoleId: string, RoleObject: Role): void {
    if (this.Get(RoleId)) {
      this.ReplaceRole(RoleId, RoleObject);
    } else {
      this.AddRole(RoleObject);
    }
  }

  public RemoveRole(RoleId: string): void {
    this.Delete(RoleId).catch((err: Error) => {
      this.Client.logger.write().error({
        message: err,
        service: 'DiscordClient.ChannelStore.RemoveRole.Store',
      });
    });
  }

  /**
   * Fetch role for role id
   * @param RoleId - id of role
   */
  public Fetch(RoleId: string): Promise<Role> {
    return new Promise(resolve => {
      resolve(this.Get(RoleId));
    });
  }
}
