"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../User/User");
var Emoji = /** @class */ (function () {
    function Emoji(EmojiObject) {
        this.id = EmojiObject.id;
        this.Name = EmojiObject.name;
        this.Roles = EmojiObject.roles;
        if (EmojiObject.user) {
            this.User = new User_1.default(EmojiObject.user);
        }
        this.RequireColons = EmojiObject.require_colons;
        this.Managed = EmojiObject.managed;
        this.Animated = EmojiObject.animated;
    }
    return Emoji;
}());
exports.default = Emoji;
