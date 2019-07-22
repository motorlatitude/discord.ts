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
var EmojiStore = /** @class */ (function (_super) {
    __extends(EmojiStore, _super);
    /**
     *
     * @param client
     * @constructor
     */
    function EmojiStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add an emoji to the store
     * @param EmojiObject - Emoji to be stored
     * @constructor
     */
    EmojiStore.prototype.AddEmoji = function (EmojiObject) {
        var _this = this;
        this.Add(EmojiObject.id, EmojiObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.EmojiStore.AddEmoji.Store',
            });
        });
    };
    /**
     * Replace an emoji or add it if it already exists
     * @param EmojiId - the id of the emoji intended to be replaced
     * @param EmojiObject - new emoji object
     * @constructor
     */
    EmojiStore.prototype.ReplaceEmoji = function (EmojiId, EmojiObject) {
        var _this = this;
        if (this.Get(EmojiId)) {
            this.Replace(EmojiId, EmojiObject).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.EmojiStore.ReplaceEmoji.Store',
                });
            });
        }
        else {
            this.AddEmoji(EmojiObject);
        }
    };
    return EmojiStore;
}(Store_1.default));
exports.default = EmojiStore;
