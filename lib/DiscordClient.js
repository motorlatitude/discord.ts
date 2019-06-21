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
// Node Modules
var events = require("events");
// NPM Modules
// Others
var ClientConnection_1 = require("./client/ClientConnection");
var Logger_1 = require("./common/Logger");
var DiscordManager_1 = require("./rest/DiscordManager");
var Guild_1 = require("./resources/Guild/Guild");
exports.Guild = Guild_1.default;
var User_1 = require("./resources/User/User");
exports.User = User_1.default;
var ChannelStore_1 = require("./stores/ChannelStore");
var GuildStore_1 = require("./stores/GuildStore");
/**
 * ## DiscordClient
 *
 * Represents DiscordClient Class and Entry Point For discord.ts
 */
var DiscordClient = /** @class */ (function (_super) {
    __extends(DiscordClient, _super);
    /**
     * Create DiscordClient Object
     * @param options - pass options, this must include a token
     */
    function DiscordClient(options) {
        var _this = _super.call(this) || this;
        _this.token = options.token;
        _this.logger = new Logger_1.default();
        _this.Channels = new ChannelStore_1.default(_this);
        _this.Guilds = new GuildStore_1.default(_this);
        _this.rest = new DiscordManager_1.default(_this.token);
        return _this;
    }
    /**
     * Retrieve Gateway URL and Connect To Discords Gateway Server
     */
    DiscordClient.prototype.connect = function () {
        var _this = this;
        this.rest
            .Methods()
            .GatewayMethods()
            .GatewayForBot()
            .then(function (response) {
            var gatewayUrl = response.url;
            var ping = response.ping;
            _this.gateway = gatewayUrl;
            _this.logger.write().debug({
                message: 'Gateway Server: ' + gatewayUrl + ' (' + ping + 'ms)',
                service: 'DiscordClient.connect',
            });
            _this.emit('GATEWAY_FOUND', gatewayUrl);
            _this.EstablishGatewayConnection(gatewayUrl);
        })
            .catch(function (err) {
            _this.logger.write().error({
                message: err,
                service: 'DiscordClient.connect',
            });
            _this.emit('DISCONNECT');
        });
    };
    /**
     * Establish a connection to discords gateway server
     * @param url - gateway server url
     */
    DiscordClient.prototype.EstablishGatewayConnection = function (url) {
        this.Connection = new ClientConnection_1.default(this, this.logger);
        this.Connection.connect(url);
    };
    return DiscordClient;
}(events.EventEmitter));
exports.DiscordClient = DiscordClient;
exports.default = DiscordClient;
