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
var events_1 = require("events");
var FluentFFMPEG = require("fluent-ffmpeg");
// @ts-ignore
var NodeOpus = require("node-opus");
/**
 * Handles playing audio
 */
var AudioPlayer = /** @class */ (function (_super) {
    __extends(AudioPlayer, _super);
    function AudioPlayer(client, vc, stream) {
        var _this = _super.call(this) || this;
        _this.Volume = 1;
        _this.Playing = false;
        _this.SamplingRate = 48000;
        _this.PacketizationSize = 20; // ms
        _this.FrameSize = (_this.SamplingRate / 100) * (_this.PacketizationSize / 10); // ?
        _this.ConvertingDone = false;
        _this.Client = client;
        _this.VoiceConnection = vc;
        _this.AudioStream = stream;
        _this.TemporaryAudioBuffer = Buffer.alloc(0);
        _this.AudioChunks = [];
        _this.EncodedAudioChunks = [];
        if (NodeOpus) {
            _this.Encoder = new NodeOpus.OpusEncoder(48000, 2);
        }
        else {
            _this.Client.logger.write().error({
                message: new Error('node-opus is not installed or properly configured'),
                service: 'VoiceManager.AudioPlayer',
            });
        }
        _this.ConvertStreamToS16LE();
        return _this;
    }
    AudioPlayer.prototype.Play = function () {
        this.VoiceConnection.SetSpeaking(true);
        this.Playing = true;
        this.SendAudioChunk(new Date().getTime(), 0);
        this.emit('PLAYING');
    };
    AudioPlayer.prototype.Pause = function () {
        this.Playing = false;
        this.SendEmptyPacket();
        this.VoiceConnection.SetSpeaking(false);
        this.emit('PAUSED');
    };
    AudioPlayer.prototype.ConvertStreamToS16LE = function () {
        var _this = this;
        var cmd = FluentFFMPEG(this.AudioStream)
            .audioChannels(2)
            .audioBitrate(128)
            .format('s16le')
            .on('error', function (err) {
            // event
            _this.Client.logger.write().error({
                message: err,
                service: 'VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg',
            });
        })
            .on('progress', function (ProgressObject) {
            // event
            _this.Client.logger.write().debug({
                message: 'Progress: ' + ProgressObject.percent + ' : ' + ProgressObject.timemark,
                service: 'VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg',
            });
        })
            .on('end', function () {
            // event
            _this.ConvertingDone = true;
            _this.Client.logger.write().debug({
                message: 'Audio Stream Input has completely been converted',
                service: 'VoiceManager.AudioPlayer.ConvertStreamToS16LE.fluent-ffmpeg',
            });
        });
        var AudioOutStream = cmd.pipe();
        var IsFirstPacket = true;
        AudioOutStream.on('data', function (chunk) {
            _this.TemporaryAudioBuffer = Buffer.concat([_this.TemporaryAudioBuffer, chunk]);
            // split data into chunks
            var ChunkSize = 1920 * 2;
            var totalLength = _this.TemporaryAudioBuffer.length;
            var remainder = totalLength % ChunkSize;
            var cutoff = totalLength - remainder;
            for (var i = 0; i < cutoff; i += ChunkSize) {
                _this.AudioChunks.push(_this.TemporaryAudioBuffer.slice(i, i + ChunkSize));
            }
            _this.TemporaryAudioBuffer = _this.TemporaryAudioBuffer.slice(cutoff, totalLength);
            // send to encode
            if (IsFirstPacket) {
                _this.EncodeAudioData();
                IsFirstPacket = false;
            }
        });
    };
    AudioPlayer.prototype.EncodeAudioData = function () {
        var _this = this;
        var Packet = this.AudioChunks.shift();
        if (Packet) {
            var OutBuffer = Buffer.alloc(Packet.length);
            var i = 0;
            while (i < Packet.length) {
                if (i >= Packet.length - 1) {
                    break;
                }
                var Multiplier = Math.pow(this.Volume, 1.660964);
                var UINT = Math.floor(Multiplier * Packet.readInt16LE(i));
                if (UINT > 32767 || UINT < -32767) {
                    this.Volume -= 0.05; // PEAKING - lower volume
                }
                UINT = Math.min(32767, UINT);
                UINT = Math.max(-32767, UINT);
                OutBuffer.writeInt16LE(UINT, i);
                i += 2;
            }
            var output = this.Encoder.encode(OutBuffer, this.FrameSize);
            this.EncodedAudioChunks.push(output);
            this.EncodeAudioData();
        }
        else if (!this.ConvertingDone) {
            setTimeout(function () {
                _this.EncodeAudioData();
            }, 10);
        }
    };
    AudioPlayer.prototype.SendAudioChunk = function (StartTime, Count) {
        var _this = this;
        // 48000 Hz sampling rate
        var NumberOfFrames = 1000 / this.PacketizationSize;
        var TimestampIncrement = 48000 / NumberOfFrames;
        if (this.Playing) {
            var Packet = this.EncodedAudioChunks.shift();
            if (Packet) {
                this.VoiceConnection.Sequence =
                    this.VoiceConnection.Sequence + 1 < 65535 ? this.VoiceConnection.Sequence + 1 : 0;
                this.VoiceConnection.Timestamp =
                    this.VoiceConnection.Timestamp + TimestampIncrement < 4294967295
                        ? this.VoiceConnection.Timestamp + TimestampIncrement
                        : 0;
                this.VoiceConnection.UDPClient.SendAudioPacket(Packet);
                var NextTime = StartTime + (Count + 1) * this.PacketizationSize;
                setTimeout(function () {
                    _this.SendAudioChunk(StartTime, Count + 1);
                }, this.PacketizationSize + (NextTime - new Date().getTime()));
            }
            else if (!this.ConvertingDone) {
                setTimeout(function () {
                    _this.SendAudioChunk(StartTime, Count);
                }, 20);
            }
            else {
                this.emit('DONE');
            }
        }
    };
    AudioPlayer.prototype.SendEmptyPacket = function () {
        var EmptyPacket = Buffer.from('F8FFFE', 'hex');
        this.VoiceConnection.UDPClient.SendAudioPacket(EmptyPacket);
    };
    return AudioPlayer;
}(events_1.EventEmitter));
exports.default = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map