"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionEmoji_1 = require("./ReactionEmoji");
var Reaction = /** @class */ (function () {
    function Reaction(ReactionObject) {
        this.Count = 0;
        this.Count = ReactionObject.count;
        this.Me = ReactionObject.me;
        this.Emoji = new ReactionEmoji_1.default(ReactionObject.emoji);
    }
    Reaction.prototype.Resolve = function () {
        return {
            count: this.Count,
            emoji: this.Emoji.Resolve(),
            me: this.Me,
        };
    };
    return Reaction;
}());
exports.default = Reaction;
