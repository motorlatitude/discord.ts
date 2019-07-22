import DiscordClient from '../DiscordClient';
import User from '../resources/User/User';
import Store from './Store';
export default class UserStore extends Store {
    constructor(client: DiscordClient);
    AddUser(UserObject: User): void;
    RemoveUser(UserId: string): void;
    Fetch(UserId: string): Promise<User>;
}
