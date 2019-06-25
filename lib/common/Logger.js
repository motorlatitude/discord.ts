"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NPM Module
var winston = require("winston");
var _a = winston.format, timestamp = _a.timestamp, printf = _a.printf;
var Logger = /** @class */ (function () {
    function Logger(level) {
        this.level = 'verbose';
        this.level = level ? level : 'verbose';
        var myFormat = printf(function (options) {
            var maxServiceLength = 65;
            var service = '';
            if (options.service) {
                service = options.service ? options.service : 'discordts';
                for (var k = 0; k < maxServiceLength - options.service.length; k++) {
                    service += ' ';
                }
            }
            var extraspace = '';
            if (options.level.match(/warn/gim) || options.level.match(/info/gim)) {
                extraspace = ' ';
            }
            if (options.message instanceof Error) {
                return ('[' +
                    options.level +
                    ']' +
                    extraspace +
                    '[' +
                    options.timestamp +
                    '] ' +
                    service +
                    ': ' +
                    options.message.stack +
                    (options.details ? '\nAttached Details: ' + JSON.stringify(options.details, null, '\t') : ''));
            }
            else {
                return ('[' +
                    options.level +
                    ']' +
                    extraspace +
                    '[' +
                    options.timestamp +
                    '] ' +
                    service +
                    ': ' +
                    options.message +
                    (options.details ? '\nAttached Details: ' + JSON.stringify(options.details, null, '\t') : ''));
            }
        });
        this.logger = winston.createLogger({
            exitOnError: false,
            format: winston.format.combine(timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), myFormat),
            level: 'debug',
            transports: [
                new winston.transports.File({
                    filename: './logs/error.log',
                    handleExceptions: true,
                    level: 'error',
                    maxFiles: 5,
                    maxsize: 5242880,
                }),
                new winston.transports.File({
                    filename: './logs/combined.log',
                    handleExceptions: true,
                    level: 'info',
                    maxFiles: 5,
                    maxsize: 5242880,
                }),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), myFormat),
                handleExceptions: true,
                level: 'debug',
            }));
        }
        else if (process.env.NODE_ENV === 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), myFormat),
                handleExceptions: true,
                level: 'info',
            }));
        }
    }
    Logger.prototype.write = function () {
        return this.logger;
    };
    return Logger;
}());
exports.default = Logger;
