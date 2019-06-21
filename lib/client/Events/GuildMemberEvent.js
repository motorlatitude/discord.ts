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
var GuildMember_1 = require("../../resources/Guild/GuildMember");
var User_1 = require("../../resources/User/User");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildMemberEvent = /** @class */ (function (_super) {
    __extends(GuildMemberEvent, _super);
    /**
     * Constructor
     * @param client - Discord Client
     */
    function GuildMemberEvent(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Handles GUILD_MEMBER_ADD event
     * @param Message - Message Data for the event
     */
    GuildMemberEvent.prototype.HandleMemberAdd = function (Message) {
        var _this = this;
        this.Client.Guilds.Fetch(Message.guild_id)
            .then(function (AffectedGuild) {
            var NewGuildMember = new GuildMember_1.default(Message);
            AffectedGuild.Members.AddGuildMember(NewGuildMember);
            _this.EventName = 'GUILD_MEMBER_ADD';
            _this.EventGuildObject = AffectedGuild;
            _this.EventGuildMemberObject = NewGuildMember;
            _this.Handle();
        })
            .catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
            });
        });
    };
    /**
     * Handles GUILD_MEMBER_REMOVE event
     * @param Message - Message Data for the event
     */
    GuildMemberEvent.prototype.HandleMemberRemove = function (Message) {
        var _this = this;
        this.Client.Guilds.Fetch(Message.guild_id)
            .then(function (AffectedGuild) {
            AffectedGuild.Members.Fetch(Message.user.id)
                .then(function (AffectedMember) {
                AffectedGuild.Members.RemoveGuildMember(Message.user.id);
                _this.EventName = 'GUILD_MEMBER_REMOVE';
                _this.EventGuildObject = AffectedGuild;
                _this.EventGuildMemberObject = AffectedMember;
                _this.Handle();
            })
                .catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
                });
            });
        })
            .catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberAdd',
            });
        });
    };
    /**
     * Handles GUILD_MEMBER_UPDATE event
     * @param Message - Message Data for the event
     */
    GuildMemberEvent.prototype.HandleMemberUpdate = function (Message) {
        var _this = this;
        this.Client.Guilds.Fetch(Message.guild_id)
            .then(function (AffectedGuild) {
            AffectedGuild.Members.Fetch(Message.user.id)
                .then(function (AffectedMember) {
                AffectedMember.Roles = Message.roles;
                AffectedMember.User = new User_1.default(Message.user);
                AffectedMember.Nick = Message.nick;
                _this.EventName = 'GUILD_MEMBER_UPDATE';
                _this.EventGuildObject = AffectedGuild;
                _this.EventGuildMemberObject = AffectedMember;
                _this.Handle();
            })
                .catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberUpdate',
                });
            });
        })
            .catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberUpdate',
            });
        });
    };
    /**
     * Handles GUILD_MEMBERS_CHUNK
     * Sent in response to Guild Request Members.
     * @param Message - Message Data for the event
     */
    GuildMemberEvent.prototype.HandleMemberChunk = function (Message) {
        var _this = this;
        this.Client.Guilds.Fetch(Message.guild_id)
            .then(function (AffectedGuild) {
            var EventMemberList = [];
            for (var _i = 0, _a = Message.members; _i < _a.length; _i++) {
                var member = _a[_i];
                var NewMember = new GuildMember_1.default(member);
                AffectedGuild.Members.UpdateGuildMember(member.user.id, NewMember);
                EventMemberList.push(NewMember);
            }
            _this.EventName = 'GUILD_MEMBERS_CHUNK';
            _this.EventGuildObject = AffectedGuild;
            _this.EventGuildMemberChunkObject = EventMemberList;
            _this.Handle();
        })
            .catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.GuildMemberEvent.HandleMemberChunk',
            });
        });
    };
    GuildMemberEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'GUILD_MEMBER_ADD' ||
            this.EventName === 'GUILD_MEMBER_REMOVE' ||
            this.EventName === 'GUILD_MEMBER_UPDATE') {
            if (this.EventGuildObject && this.EventGuildMemberObject) {
                this.Client.emit(this.EventName, this.EventGuildObject, this.EventGuildMemberObject);
            }
        }
        else if (this.EventName === 'GUILD_MEMBERS_CHUNK') {
            if (this.EventGuildObject && this.EventGuildMemberChunkObject) {
                this.Client.emit(this.EventName, this.EventGuildObject, this.EventGuildMemberChunkObject);
            }
        }
    };
    return GuildMemberEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildMemberEvent;