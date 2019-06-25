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
var VoiceManager_1 = require("../../voice/VoiceManager");
var Channel_1 = require("./Channel");
var VoiceChannel = /** @class */ (function (_super) {
    __extends(VoiceChannel, _super);
    function VoiceChannel(Client, ChannelObject, guild) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        if (guild) {
            _this.Guild = guild;
            _this.GuildId = guild.id;
        }
        _this.Position = ChannelObject.position;
        _this.PermissionOverwrites = ChannelObject.permission_overwrites;
        _this.Name = ChannelObject.name;
        _this.Bitrate = ChannelObject.bitrate;
        _this.UserLimit = ChannelObject.user_limit;
        return _this;
    }
    /**
     * Join this voice channel
     */
    VoiceChannel.prototype.Join = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.Client.Connection && _this.GuildId) {
                _this.Client.on('VOICE_SERVER_UPDATE', function (NewVoiceManager) {
                    _this.VoiceManager = NewVoiceManager;
                    resolve(NewVoiceManager);
                });
                _this.Client.Connection.JoinVoiceChannel(_this.GuildId, _this.id);
            }
            else {
                reject(new Error('This Channel is either not part of a guild or there is no active client connection'));
            }
        });
    };
    /**
     * Leave this voice channel
     */
    VoiceChannel.prototype.Leave = function () {
        if (this.VoiceManager instanceof VoiceManager_1.default && this.Client.Connection && this.GuildId) {
            this.Client.Connection.LeaveVoiceChannel(this.GuildId);
            this.VoiceManager.VoiceConnection.Disconnect();
            delete this.VoiceManager;
        }
    };
    return VoiceChannel;
}(Channel_1.default));
exports.default = VoiceChannel;
