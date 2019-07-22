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
var ResumedEvent = /** @class */ (function (_super) {
    __extends(ResumedEvent, _super);
    function ResumedEvent(client, msg) {
        var _this = _super.call(this, client) || this;
        _this.EventName = 'RESUMED';
        _this.Message = msg;
        return _this;
    }
    ResumedEvent.prototype.Handle = function () {
        _super.prototype.Handle.call(this);
    };
    ResumedEvent.prototype.EmitEvent = function () {
        this.Client.emit(this.EventName);
    };
    return ResumedEvent;
}(ClientDispatcherEvent_1.default));
exports.default = ResumedEvent;
