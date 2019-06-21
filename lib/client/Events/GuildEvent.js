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
var Guild_1 = require("../../resources/Guild/Guild");
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var GuildEvent = /** @class */ (function (_super) {
    __extends(GuildEvent, _super);
    function GuildEvent(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Handles GUILD_CREATE event
     * GUILD_CREATE event is sent when
     * 1. When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the Ready event.
     * 2. When a Guild becomes available again to the client.
     * 3. When the current user joins a new Guild.
     * https://discordapp.com/developers/docs/topics/gateway#guild-create
     * @param Message GUILD_CREATE event package
     */
    GuildEvent.prototype.HandleCreate = function (Message) {
        this.EventName = 'GUILD_CREATE';
        this.EventObject = new Guild_1.default(this.Client, Message);
        this.Client.Guilds.AddGuild(this.EventObject);
        this.Handle();
    };
    /**
     * Handles GUILD_UPDATE event
     * @param Message GUILD_UPDATE event package
     */
    GuildEvent.prototype.HandleUpdate = function (Message) {
        this.EventName = 'GUILD_UPDATE';
        this.EventObject = new Guild_1.default(this.Client, Message);
        this.Client.Guilds.ReplaceGuild(Message.id, this.EventObject);
        this.Handle();
    };
    /**
     * Handles GUILD_DELETE event
     * @param Message GUILD_DELETE event package
     */
    GuildEvent.prototype.HandleDelete = function (Message) {
        this.EventName = 'GUILD_DELETE';
        var WasKicked = false;
        if (Message.unavailable === undefined || Message.unavailable === null) {
            WasKicked = true;
        }
        this.EventDeleteObject = {
            Unavailable: Message.unavailable,
            WasRemoved: WasKicked,
            id: Message.id,
        };
        this.Client.Guilds.RemoveGuild(Message.id);
        this.Handle();
    };
    GuildEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'GUILD_CREATE' || this.EventName === 'GUILD_UPDATE') {
            if (this.EventObject instanceof Guild_1.default) {
                this.Client.emit(this.EventName, this.EventObject);
            }
        }
        else if (this.EventName === 'GUILD_DELETE') {
            if (this.EventDeleteObject) {
                this.Client.emit(this.EventName, this.EventDeleteObject);
            }
        }
    };
    return GuildEvent;
}(ClientDispatcherEvent_1.default));
exports.default = GuildEvent;
