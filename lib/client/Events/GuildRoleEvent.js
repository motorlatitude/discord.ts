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
var Role_1 = require("../../resources/Guild/Role");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildRoleEvent = /** @class */ (function (_super) {
    __extends(GuildRoleEvent, _super);
    function GuildRoleEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.Message = msg;
        return _this;
    }
    /**
     * Handles GUILD_ROLE_CREATE event
     */
    GuildRoleEvent.prototype.HandleRoleCreate = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id)
            .then(function (AffectedGuild) {
            if (_this.Message.role) {
                var role = new Role_1.default(_this.Message.role);
                AffectedGuild.Roles.AddRole(role);
                _this.EventName = 'GUILD_ROLE_CREATE';
                _this.EventGuildObject = AffectedGuild;
                _this.EventRoleObject = role;
                _this.Handle();
            }
            else {
                // Shouldn't happen
                _this.Client.logger.write().warn({
                    message: 'We got a GUILD_ROLE_CREATE event but no role was supplied',
                    service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleCreate',
                });
            }
        })
            .catch(function (err) {
            _this.Client.logger.write().warn({
                message: err,
                service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleCreate',
            });
        });
    };
    /**
     * Handles GUILD_ROLE_UPDATE event
     */
    GuildRoleEvent.prototype.HandleRoleUpdate = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id)
            .then(function (AffectedGuild) {
            if (_this.Message.role) {
                var UpdatedRole = new Role_1.default(_this.Message.role);
                AffectedGuild.Roles.UpdateRole(_this.Message.role.id, UpdatedRole);
                _this.EventName = 'GUILD_ROLE_UPDATE';
                _this.EventGuildObject = AffectedGuild;
                _this.EventRoleObject = UpdatedRole;
                _this.Handle();
            }
            else {
                // Shouldn't happen
                _this.Client.logger.write().warn({
                    message: 'We got a GUILD_ROLE_UPDATE event but no role was supplied',
                    service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleUpdate',
                });
            }
        })
            .catch(function (err) {
            _this.Client.logger.write().warn({
                message: err,
                service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleUpdate',
            });
        });
    };
    /**
     * Handles GUILD_ROLE_DELETE event
     */
    GuildRoleEvent.prototype.HandleRoleDelete = function () {
        var _this = this;
        this.Client.Guilds.Fetch(this.Message.guild_id)
            .then(function (AffectedGuild) {
            if (_this.Message.role_id) {
                AffectedGuild.Roles.Fetch(_this.Message.role_id)
                    .then(function (AffectedRole) {
                    AffectedGuild.Roles.RemoveRole(AffectedRole.id);
                    _this.EventName = 'GUILD_ROLE_DELETE';
                    _this.EventGuildObject = AffectedGuild;
                    _this.EventRoleObject = AffectedRole;
                    _this.Handle();
                })
                    .catch(function (err) {
                    _this.Client.logger.write().warn({
                        message: err,
                        service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
                    });
                });
            }
            else {
                // Shouldn't happen
                _this.Client.logger.write().warn({
                    message: 'We got a GUILD_ROLE_DELETE event but no role_id was supplied',
                    service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
                });
            }
        })
            .catch(function (err) {
            _this.Client.logger.write().warn({
                message: err,
                service: 'ClientDispatcher.Events.GuildRoleEvent.HandleRoleDelete',
            });
        });
    };
    GuildRoleEvent.prototype.EmitEvent = function () {
        if (this.EventName && this.EventGuildObject && this.EventRoleObject) {
            this.Client.emit(this.EventName, this.EventGuildObject, this.EventRoleObject);
        }
    };
    return GuildRoleEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildRoleEvent;
