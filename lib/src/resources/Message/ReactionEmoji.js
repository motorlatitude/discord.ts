"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionEmoji = /** @class */ (function () {
    function ReactionEmoji(ReactionEmojiObject) {
        this.Name = ReactionEmojiObject.name;
        this.id = ReactionEmojiObject.id;
    }
    ReactionEmoji.prototype.Resolve = function () {
        return {
            id: this.id,
            name: this.Name,
        };
    };
    return ReactionEmoji;
}());
exports.default = ReactionEmoji;
