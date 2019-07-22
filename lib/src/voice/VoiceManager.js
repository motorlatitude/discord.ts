"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var AudioPlayer_1 = require("./AudioPlayer/AudioPlayer");
/**
 * Interfaces between Developer and Voice Connection
 */
var VoiceManager = /** @class */ (function () {
    function VoiceManager(client, vc) {
        this.Client = client;
        this.VoiceConnection = vc;
    }
    VoiceManager.prototype.PlayStream = function (Stream) {
        return new AudioPlayer_1.default(this.Client, this.VoiceConnection, Stream);
    };
    VoiceManager.prototype.PlayFile = function (FilePath) {
        var readStream = fs.createReadStream(FilePath);
        return this.PlayStream(readStream);
    };
    return VoiceManager;
}());
exports.default = VoiceManager;
