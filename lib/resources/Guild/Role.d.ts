import { IDiscordRole } from '../../common/types';
export default class Role {
    id: string;
    Name: string;
    Color: number;
    Hoist: boolean;
    Position: number;
    Permissions: number;
    Managed: boolean;
    Mentionable: boolean;
    constructor(RoleObject: IDiscordRole);
}
