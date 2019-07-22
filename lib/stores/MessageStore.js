"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Store_1 = require("./Store");
var MessageStore = /** @class */ (function (_super) {
    __extends(MessageStore, _super);
    function MessageStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add a new message to the store
     * @param message - The message to store
     */
    MessageStore.prototype.AddMessage = function (message) {
        var _this = this;
        this.Add(message.id, message).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.MessageStore.AddMessage.Store',
            });
        });
    };
    /**
     * Replace an existing message in the store
     * @param MessageId - the message id of the message to be replaced
     * @param message - the new message which will replace the old one
     */
    MessageStore.prototype.ReplaceMessage = function (MessageId, message) {
        var _this = this;
        this.Replace(MessageId, message).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.MessageStore.ReplaceMessage.Store',
            });
        });
    };
    /**
     * Delete an existing message in the store
     * @param MessageId - id of the message to delete
     */
    MessageStore.prototype.DeleteMessage = function (MessageId) {
        var _this = this;
        this.Delete(MessageId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.MessageStore.DeleteMessage.Store',
            });
        });
    };
    /**
     * Async get message
     * @param MessageId - id of message
     * @constructor
     */
    MessageStore.prototype.Get = function (MessageId) {
        return _super.prototype.Get.call(this, MessageId);
    };
    /**
     * Fetch message from message id
     * @param MessageId - the id of the message
     */
    MessageStore.prototype.Fetch = function (MessageId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(MessageId));
        });
    };
    /**
     * Fetch array of messages for an array of message ids
     * @param MessageIds - array of message ids
     */
    MessageStore.prototype.FetchAllFor = function (MessageIds) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.GetAllForKeys(MessageIds));
        });
    };
    return MessageStore;
}(Store_1.default));
exports.default = MessageStore;
//# sourceMappingURL=MessageStore.js.map