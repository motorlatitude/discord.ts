"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./../../common/constants/http");
var GatewayMethods = /** @class */ (function () {
    function GatewayMethods(r) {
        this.Requester = r;
    }
    GatewayMethods.prototype.GatewayForBot = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.Requester.SendRequest(http_1.default.GET, '/gateway/bot?v=6')
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
    GatewayMethods.prototype.GatewayForUser = function () {
        this.Requester.SendRequest(http_1.default.GET, '/gateway?v=6');
    };
    return GatewayMethods;
}());
exports.default = GatewayMethods;
