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
var Channel_1 = require("./Channel");
var CategoryChannel = /** @class */ (function (_super) {
    __extends(CategoryChannel, _super);
    function CategoryChannel(Client, ChannelObject, guild) {
        var _this = _super.call(this, Client, ChannelObject) || this;
        _this.Guild = guild;
        _this.Name = ChannelObject.name;
        _this.Position = ChannelObject.position;
        _this.PermissionOverwrites = ChannelObject.permission_overwrites;
        return _this;
    }
    return CategoryChannel;
}(Channel_1.default));
exports.default = CategoryChannel;
