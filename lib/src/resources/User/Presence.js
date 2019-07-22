"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Activity_1 = require("./Activity");
var Presence = /** @class */ (function () {
    function Presence(Client, PresenceObject) {
        var _this = this;
        this.User = { id: PresenceObject.user.id };
        if (PresenceObject.guild_id) {
            // good we got a starting point
            Client.Guilds.Fetch(PresenceObject.guild_id)
                .then(function (AffectedGuild) {
                if (AffectedGuild) {
                    AffectedGuild.Members.Fetch(PresenceObject.user.id)
                        .then(function (AffectedMember) {
                        _this.User = AffectedMember.User;
                    })
                        .catch(function (err) {
                        Client.logger.write().error({
                            message: err,
                            service: 'User.Presence',
                        });
                    });
                }
            })
                .catch(function (err) {
                Client.logger.write().error({
                    message: err,
                    service: 'User.Presence',
                });
            });
        }
        this.Roles = PresenceObject.roles;
        this.Status = PresenceObject.status;
        this.ClientStatus = PresenceObject.client_status;
        if (PresenceObject.game) {
            this.Game = new Activity_1.default(PresenceObject.game);
        }
        this.Activities = [];
        if (PresenceObject.activities) {
            for (var _i = 0, _a = PresenceObject.activities; _i < _a.length; _i++) {
                var activity = _a[_i];
                this.Activities.push(new Activity_1.default(activity));
            }
        }
    }
    return Presence;
}());
exports.default = Presence;
