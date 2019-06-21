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
var DirectMessageChannel_1 = require("../resources/Channel/DirectMessageChannel");
var TextChannel_1 = require("../resources/Channel/TextChannel");
var VoiceChannel_1 = require("../resources/Channel/VoiceChannel");
var Store_1 = require("./Store");
var ChannelStore = /** @class */ (function (_super) {
    __extends(ChannelStore, _super);
    /**
     * Constructor
     * @param client
     * @constructor
     */
    function ChannelStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add a Text Channel to the Channel Store
     * @param TextChannelToBeStored - A TextChannel
     */
    ChannelStore.prototype.AddTextChannel = function (TextChannelToBeStored) {
        var _this = this;
        this.Add(TextChannelToBeStored.id, TextChannelToBeStored).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.AddTextChannel.Store',
            });
        });
    };
    /**
     * Add a Voice Channel to the Channel Store
     * @param VoiceChannelToBeStored - A VoiceChannel
     */
    ChannelStore.prototype.AddVoiceChannel = function (VoiceChannelToBeStored) {
        var _this = this;
        this.Add(VoiceChannelToBeStored.id, VoiceChannelToBeStored).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.AddVoiceChannel.Store',
            });
        });
    };
    /**
     * Add a Direct Message Channel to the Channel Store
     * @param DMChannelToBeStored - A DirectMessageChannel
     */
    ChannelStore.prototype.AddDMChannel = function (DMChannelToBeStored) {
        var _this = this;
        this.Add(DMChannelToBeStored.id, DMChannelToBeStored).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.AddDMChannel.Store',
            });
        });
    };
    /**
     * Add a Channel Category to the Channel Store
     * @param ChannelCategory - A CategoryChannel
     */
    ChannelStore.prototype.AddChannelCategory = function (ChannelCategory) {
        var _this = this;
        this.Add(ChannelCategory.id, ChannelCategory).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.AddChannelCategory.Store',
            });
        });
    };
    /**
     * Replace an existing Text Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A TextChannel
     */
    ChannelStore.prototype.ReplaceTextChannel = function (ChannelId, Channel) {
        var _this = this;
        this.Replace(ChannelId, Channel).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.ReplaceTextChannel.Store',
            });
        });
    };
    /**
     * Replace an existing Voice Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A VoiceChannel
     */
    ChannelStore.prototype.ReplaceVoiceChannel = function (ChannelId, Channel) {
        var _this = this;
        this.Replace(ChannelId, Channel).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.ReplaceVoiceChannel.Store',
            });
        });
    };
    /**
     * Replace an existing Voice Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A VoiceChannel
     */
    ChannelStore.prototype.ReplaceDirectMessageChannel = function (ChannelId, Channel) {
        var _this = this;
        this.Replace(ChannelId, Channel).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.ReplaceDirectMessageChannel.Store',
            });
        });
    };
    /**
     * Replace an existing Category Channel in the Channel Store
     * @param ChannelId - The id of the channel
     * @param Channel - A CategoryChannel
     */
    ChannelStore.prototype.ReplaceChannelCategory = function (ChannelId, Channel) {
        var _this = this;
        this.Replace(ChannelId, Channel).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.ReplaceChannelCategory.Store',
            });
        });
    };
    ChannelStore.prototype.ReplaceChannel = function (ChannelId, Channel) {
        if (Channel instanceof TextChannel_1.default) {
            this.ReplaceTextChannel(ChannelId, Channel);
        }
        else if (Channel instanceof VoiceChannel_1.default) {
            this.ReplaceVoiceChannel(ChannelId, Channel);
        }
        else if (Channel instanceof DirectMessageChannel_1.default) {
            this.ReplaceDirectMessageChannel(ChannelId, Channel);
        }
        else {
            this.ReplaceChannelCategory(ChannelId, Channel);
        }
    };
    ChannelStore.prototype.RemoveChannel = function (ChannelId) {
        var _this = this;
        this.Delete(ChannelId).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ChannelStore.RemoveChannel.Store',
            });
        });
    };
    /**
     * Fetch a Text Channel
     * @param ChannelId - channel id of the text channel
     */
    ChannelStore.prototype.FetchTextChannel = function (ChannelId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var Channel = _this.Get(ChannelId);
            if (Channel instanceof TextChannel_1.default) {
                resolve(Channel);
            }
            else {
                reject(new Error('The returned channel for the id is not a TextChannel'));
            }
        });
    };
    /**
     * Fetch a Direct Message Channel
     * @param ChannelId - channel id of the direct message channel
     */
    ChannelStore.prototype.FetchDirectMessageChannel = function (ChannelId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var Channel = _this.Get(ChannelId);
            if (Channel instanceof DirectMessageChannel_1.default) {
                resolve(Channel);
            }
            else {
                reject(new Error('The returned channel for the id is not a DirectMessageChannel'));
            }
        });
    };
    /**
     * Fetch a TextChannel, VoiceChannel, DirectMessageChannel or CategoryChannel with an id
     * @param ChannelId - channel id
     */
    ChannelStore.prototype.FetchAllTypes = function (ChannelId) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.Get(ChannelId));
        });
    };
    return ChannelStore;
}(Store_1.default));
exports.default = ChannelStore;
