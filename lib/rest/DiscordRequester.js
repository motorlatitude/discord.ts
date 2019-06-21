"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Node Modules
var req = require("request");
var api_1 = require("./../common/constants/api");
// Types
var DiscordRequester = /** @class */ (function () {
    function DiscordRequester(token) {
        this.token = token;
        this.host = api_1.default.host;
    }
    DiscordRequester.prototype.SendRequest = function (method, endpoint, data) {
        var self = this;
        return new Promise(function (resolve, reject) {
            req({
                body: data,
                headers: {
                    Authorization: 'Bot ' + self.token,
                },
                json: true,
                method: method,
                url: self.host + endpoint,
            }, function (err, httpResponse, body) {
                if (httpResponse) {
                    var status_1 = httpResponse.statusCode;
                    if (err) {
                        reject(err);
                    }
                    else if (status_1 === 400 ||
                        status_1 === 401 ||
                        status_1 === 403 ||
                        status_1 === 404 ||
                        status_1 === 405 ||
                        status_1 === 502 ||
                        status_1 === 500) {
                        reject({
                            body: body,
                            httpResponse: httpResponse,
                            statusCode: status_1,
                            statusMessage: httpResponse.statusMessage,
                        });
                    }
                    else {
                        resolve({ httpResponse: httpResponse, body: body });
                    }
                }
                else {
                    reject({ statusCode: 500, statusMessage: 'No Response', httpResponse: httpResponse, body: body });
                }
            });
        });
    };
    DiscordRequester.prototype.SendUploadRequest = function (method, endpoint, data, file, filename) {
        return true;
    };
    return DiscordRequester;
}());
exports.default = DiscordRequester;
