"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./../../common/constants/http");
var GatewayMethods = /** @class */ (function () {
    function GatewayMethods(r) {
        this.Requester = r;
    }
    GatewayMethods.prototype.GatewayForBot = function () {
        return this.GetGateway('/gateway/bot?v=6');
    };
    GatewayMethods.prototype.GatewayForUser = function () {
        return this.GetGateway('/gateway?v=6');
    };
    GatewayMethods.prototype.GetGateway = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Requester.SendRequest(http_1.default.GET, url)
                .then(function (response) {
                resolve({
                    ping: response.httpResponse.elapsedTime,
                    url: response.body.url,
                });
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GatewayMethods;
}());
exports.default = GatewayMethods;
//# sourceMappingURL=GatewayMethods.js.map