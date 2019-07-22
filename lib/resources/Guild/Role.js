"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Role = /** @class */ (function () {
    function Role(RoleObject) {
        this.id = RoleObject.id;
        this.Name = RoleObject.name;
        this.Color = RoleObject.color;
        this.Hoist = RoleObject.hoist;
        this.Position = RoleObject.position;
        this.Permissions = RoleObject.permissions;
        this.Managed = RoleObject.managed;
        this.Mentionable = RoleObject.mentionable;
    }
    return Role;
}());
exports.default = Role;
//# sourceMappingURL=Role.js.map