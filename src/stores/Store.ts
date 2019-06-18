import DiscordClient from '../DiscordClient';

export default class Store {
  public StoredItems: { [key: string]: any };
  public Client: DiscordClient;

  constructor(client: DiscordClient) {
    this.StoredItems = {};
    this.Client = client;
  }

  /**
   * Add Item To Store
   */
  public Add(key: string, item: any): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      if (this.StoredItems[key]) {
        // An Item With This Key Already Exists Here?
        reject(new Error('Could not add item to store as an item with that key already exists'));
      } else {
        this.StoredItems[key] = item;
        resolve();
      }
    });
  }

  public Get(key: string): any {
    return this.StoredItems[key];
  }
}
