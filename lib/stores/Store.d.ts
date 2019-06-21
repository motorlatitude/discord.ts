import DiscordClient from '../DiscordClient';
export default class Store {
    StoredItems: {
        [key: string]: any;
    };
    Client: DiscordClient;
    constructor(client: DiscordClient);
    /**
     * Add Item To Store
     */
    Add(key: string, item: any): Promise<null | Error>;
    Get(key: string): any;
    GetAllForKeys(keys: string[]): any;
    GetAll(): any;
    Delete(key: string): Promise<null | Error>;
    Modify(key: string, param: string, value: any): Promise<null | Error>;
    Replace(key: string, item: any): Promise<null | Error>;
}
