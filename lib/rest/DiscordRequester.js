"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var req = require("request");
var api_1 = require("./../common/constants/api");
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
                    'User-Agent': 'DiscordBot (https://github.com/motorlatitude/discord.ts, ' +
                        require('./../../package.json').version +
                        ')',
                },
                json: true,
                method: method,
                time: true,
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
    DiscordRequester.prototype.SendFormRequest = function (method, endpoint, data, filename, file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var FormRequest = req({
                headers: {
                    Authorization: 'Bot ' + _this.token,
                    'Content-Type': 'multipart/form-data',
                    'User-Agent': 'DiscordBot (https://github.com/motorlatitude/discord.ts, ' +
                        require('./../../package.json').version +
                        ')',
                },
                method: method,
                time: true,
                url: _this.host + endpoint,
            }, function (err, httpResponse, body) {
                if (httpResponse) {
                    var status_2 = httpResponse.statusCode;
                    if (err) {
                        reject(err);
                    }
                    else if (status_2 === 400 ||
                        status_2 === 401 ||
                        status_2 === 403 ||
                        status_2 === 404 ||
                        status_2 === 405 ||
                        status_2 === 502 ||
                        status_2 === 500) {
                        reject({
                            body: body,
                            httpResponse: httpResponse,
                            statusCode: status_2,
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
            var Form = FormRequest.form();
            Form.append('file', file, { filename: filename });
            Form.append('payload_json', JSON.stringify(data));
        });
    };
    return DiscordRequester;
}());
exports.default = DiscordRequester;
//# sourceMappingURL=DiscordRequester.js.map