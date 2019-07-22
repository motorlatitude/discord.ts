"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store = /** @class */ (function () {
    function Store(client) {
        this.StoredItems = {};
        this.Client = client;
    }
    /**
     * Add Item To Store
     */
    Store.prototype.Add = function (key, item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.StoredItems[key]) {
                // An Item With This Key Already Exists Here?
                reject(new Error('Could not add item to store as an item with that key already exists'));
            }
            else {
                _this.StoredItems[key] = item;
                resolve();
            }
        });
    };
    /**
     * Get item with key from store
     * @param key - the key of the item
     */
    Store.prototype.Get = function (key) {
        return this.StoredItems[key];
    };
    /**
     * Get the number of objects in the store
     */
    Store.prototype.Length = function () {
        return Object.keys(this.StoredItems).length;
    };
    Store.prototype.GetAllForKeys = function (keys) {
        var returnedItems = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            returnedItems.push(this.StoredItems[key]);
        }
        return returnedItems;
    };
    Store.prototype.GetAll = function () {
        return this.StoredItems;
    };
    Store.prototype.Delete = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.StoredItems[key]) {
                delete _this.StoredItems[key];
                resolve();
            }
            else {
                reject(new Error('An item with that key does not exist'));
            }
        });
    };
    Store.prototype.Modify = function (key, param, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.StoredItems[key]) {
                if (_this.StoredItems[key][param] != null) {
                    _this.StoredItems[key][param] = value;
                    resolve();
                }
                else {
                    reject(new Error('This item does not have a parameter called ' + param));
                }
            }
            else {
                reject(new Error('An item with that key does not exist'));
            }
        });
    };
    Store.prototype.Replace = function (key, item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.StoredItems[key]) {
                resolve();
                _this.StoredItems[key] = item;
            }
            else {
                reject(new Error('An item with that key does not exist'));
            }
        });
    };
    return Store;
}());
exports.default = Store;
//# sourceMappingURL=Store.js.map