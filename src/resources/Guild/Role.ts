import { IDiscordRole } from '../../common/types';

export default class Role {
  public id: string;
  public Name: string;
  public Color: number;
  public Hoist: boolean;
  public Position: number;
  public Permissions: number;
  public Managed: boolean;
  public Mentionable: boolean;

  constructor(RoleObject: IDiscordRole) {
    this.id = RoleObject.id;
    this.Name = RoleObject.name;
    this.Color = RoleObject.color;
    this.Hoist = RoleObject.hoist;
    this.Position = RoleObject.position;
    this.Permissions = RoleObject.permissions;
    this.Managed = RoleObject.managed;
    this.Mentionable = RoleObject.mentionable;
  }
}
