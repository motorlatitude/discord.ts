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
var Store_1 = require("./Store");
var VoiceStateStore = /** @class */ (function (_super) {
    __extends(VoiceStateStore, _super);
    function VoiceStateStore(client) {
        return _super.call(this, client) || this;
    }
    VoiceStateStore.prototype.AddVoiceState = function (VoiceStateObject) {
        var _this = this;
        this.Add(VoiceStateObject.UserId, VoiceStateObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.VoiceStateStore.AddVoiceState.Store',
            });
        });
    };
    VoiceStateStore.prototype.UpdateVoiceState = function (UserId, VoiceStateObject) {
        var _this = this;
        if (this.Get(UserId)) {
            this.Replace(UserId, VoiceStateObject).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.VoiceStateStore.UpdateVoiceState.Store.Replace',
                });
            });
        }
        else {
            this.AddVoiceState(VoiceStateObject);
        }
    };
    VoiceStateStore.prototype.RemoveVoiceState = function (UserId) {
        var _this = this;
        if (this.Get(UserId)) {
            this.Delete(UserId).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.VoiceStateStore.RemoveVoiceState.Store',
                });
            });
        }
        else {
            // Nothing to delete
        }
    };
    return VoiceStateStore;
}(Store_1.default));
exports.default = VoiceStateStore;
//# sourceMappingURL=VoiceStateStore.js.map