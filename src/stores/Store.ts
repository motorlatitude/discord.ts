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

  /**
   * Get item with key from store
   * @param key - the key of the item
   */
  public Get(key: string): any {
    return this.StoredItems[key];
  }

  /**
   * Get the number of objects in the store
   */
  public Length(): number {
    return Object.keys(this.StoredItems).length;
  }

  public GetAllForKeys(keys: string[]): any {
    const returnedItems = [];
    for (const key of keys) {
      returnedItems.push(this.StoredItems[key]);
    }
    return returnedItems;
  }

  public GetAll(): any {
    return this.StoredItems;
  }

  public Delete(key: string): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      if (this.StoredItems[key]) {
        delete this.StoredItems[key];
        resolve();
      } else {
        reject(new Error('An item with that key does not exist'));
      }
    });
  }

  public Modify(key: string, param: string, value: any): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      if (this.StoredItems[key]) {
        if (this.StoredItems[key][param] != null) {
          this.StoredItems[key][param] = value;
          resolve();
        } else {
          reject(new Error('This item does not have a parameter called ' + param));
        }
      } else {
        reject(new Error('An item with that key does not exist'));
      }
    });
  }

  public Replace(key: string, item: any): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      if (this.StoredItems[key]) {
        resolve();
        this.StoredItems[key] = item;
      } else {
        reject(new Error('An item with that key does not exist'));
      }
    });
  }
}
