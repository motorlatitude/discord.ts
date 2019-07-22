"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(UserObject) {
        this.id = UserObject.id;
        this.Username = UserObject.username;
        this.Discriminator = UserObject.discriminator;
        this.PremiumType = UserObject.premium_type;
        this.Flags = UserObject.flags;
        this.Email = UserObject.email;
        this.Verified = UserObject.verified;
        this.Locale = UserObject.locale;
        this.MFAEnabled = UserObject.bot;
        this.Avatar = UserObject.avatar;
    }
    User.prototype.Resolve = function () {
        return {
            avatar: this.Avatar,
            bot: this.Bot,
            discriminator: this.Discriminator,
            email: this.Email,
            flags: this.Flags,
            id: this.id,
            locale: this.Locale,
            mfa_enabled: this.MFAEnabled,
            premium_type: this.PremiumType,
            username: this.Username,
            verified: this.Verified,
        };
    };
    return User;
}());
exports.default = User;
//# sourceMappingURL=User.js.map