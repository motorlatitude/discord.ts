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
var ClientDispatcherEvent_1 = require("./ClientDispatcherEvent");
var TextChannel_1 = require("../../resources/Channel/TextChannel");
var channeltypes_1 = require("../../common/constants/channeltypes");
var CategoryChannel_1 = require("../../resources/Channel/CategoryChannel");
var DirectMessageChannel_1 = require("../../resources/Channel/DirectMessageChannel");
var VoiceChannel_1 = require("../../resources/Channel/VoiceChannel");
var ChannelEvent = /** @class */ (function (_super) {
    __extends(ChannelEvent, _super);
    function ChannelEvent(client, data) {
        var _this = _super.call(this, client) || this;
        _this.EventName = '';
        _this.Message = data;
        return _this;
    }
    /**
     * Handle CHANNEL_CREATE event
     */
    ChannelEvent.prototype.HandleCreate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.EventName = 'CHANNEL_CREATE';
            if (_this.Message.guild_id) {
                _this.Client.Guilds.Fetch(_this.Message.guild_id)
                    .then(function (AffectedGuild) {
                    if (_this.Message.type === channeltypes_1.default.GUILD_TEXT) {
                        var NewTextChannel = new TextChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                        _this.EventObject = NewTextChannel;
                        AffectedGuild.Channels.AddTextChannel(NewTextChannel);
                    }
                    else if (_this.Message.type === channeltypes_1.default.GUILD_VOICE) {
                        var NewVoiceChannel = new VoiceChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                        _this.EventObject = NewVoiceChannel;
                        AffectedGuild.Channels.AddVoiceChannel(NewVoiceChannel);
                    }
                    else if (_this.Message.type === channeltypes_1.default.GUILD_CATEGORY) {
                        var NewChannelCategory = new CategoryChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                        _this.EventObject = NewChannelCategory;
                        AffectedGuild.Channels.AddChannelCategory(NewChannelCategory);
                    }
                    if (_this.EventObject) {
                        _this.Handle();
                        resolve(_this.EventObject);
                    }
                    else {
                        reject(new Error('Unhandled Channel Type: ' + _this.Message.type));
                    }
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            else {
                if (_this.Message.type === channeltypes_1.default.DM || _this.Message.type === channeltypes_1.default.GROUP_DM) {
                    var NewDMChannel = new DirectMessageChannel_1.default(_this.Client, _this.Message);
                    _this.EventObject = NewDMChannel;
                    _this.Client.Channels.AddDMChannel(NewDMChannel);
                    _this.Handle();
                    resolve(_this.EventObject);
                }
                else {
                    reject(new Error('Unhandled Channel Type: ' + _this.Message.type));
                }
            }
        });
    };
    /**
     * Handle CHANNEL_UPDATE event
     */
    ChannelEvent.prototype.HandleUpdate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.EventName = 'CHANNEL_UPDATE';
            if (_this.Message.guild_id) {
                _this.Client.Guilds.Fetch(_this.Message.guild_id).then(function (AffectedGuild) {
                    var NewChannel;
                    if (_this.Message.type === channeltypes_1.default.GUILD_TEXT) {
                        NewChannel = new TextChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                    }
                    else if (_this.Message.type === channeltypes_1.default.GUILD_VOICE) {
                        NewChannel = new VoiceChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                    }
                    else if (_this.Message.type === channeltypes_1.default.GUILD_CATEGORY) {
                        NewChannel = new CategoryChannel_1.default(_this.Client, _this.Message, AffectedGuild);
                    }
                    if (NewChannel) {
                        _this.EventObject = NewChannel;
                        AffectedGuild.Channels.ReplaceChannel(_this.Message.id, NewChannel);
                        _this.Handle();
                        resolve(_this.EventObject);
                    }
                });
            }
            else if (_this.Message.type === channeltypes_1.default.DM || _this.Message.type === channeltypes_1.default.GROUP_DM) {
                var NewChannel = new DirectMessageChannel_1.default(_this.Client, _this.Message);
                _this.EventObject = NewChannel;
                _this.Client.Channels.ReplaceChannel(_this.Message.id, NewChannel);
                _this.Handle();
                resolve(_this.EventObject);
            }
            else {
                reject(new Error('Unhandled Guild Channel Combination'));
            }
        });
    };
    /**
     * Handle CHANNEL_DELETE
     */
    ChannelEvent.prototype.HandleDelete = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.EventName = 'CHANNEL_DELETE';
            _this.EventDeleteObject = {
                Id: _this.Message.id,
                Type: _this.Message.type,
            };
            _this.Client.Channels.RemoveChannel(_this.Message.id);
            _this.Handle();
            resolve(_this.EventDeleteObject);
        });
    };
    /**
     * Handle Emitting To Client
     * @override
     */
    ChannelEvent.prototype.EmitEvent = function () {
        if (this.EventName === 'CHANNEL_UPDATE' || this.EventName === 'CHANNEL_CREATE') {
            if (this.EventObject) {
                this.Client.emit(this.EventName, this.EventObject);
            }
        }
        else if (this.EventName === 'CHANNEL_DELETE' && this.EventDeleteObject) {
            this.Client.emit(this.EventName, this.EventDeleteObject);
        }
    };
    return ChannelEvent;
}(ClientDispatcherEvent_1.default));
exports.default = ChannelEvent;
//# sourceMappingURL=ChannelEvent.js.map