"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./../../common/constants/http");
var AuditMethods = /** @class */ (function () {
    function AuditMethods(r) {
        this.Requester = r;
    }
    /**
     * GET /guilds/{guild.id}/audit-logs
     * @param GuildId - the id of the guild of which to fetch the audit log
     * @param Options - query options to attach to this request
     */
    AuditMethods.prototype.GetGuildAuditLog = function (GuildId, Options) {
        var QueryOptions = '?';
        Object.entries(Options).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return (QueryOptions += key + '=' + value + '&');
        });
        return this.Requester.SendRequest(http_1.default.POST, '/guilds/' + GuildId + '/audit-logs' + QueryOptions.slice(0, -1));
    };
    return AuditMethods;
}());
exports.default = AuditMethods;
//# sourceMappingURL=AuditMethods.js.map