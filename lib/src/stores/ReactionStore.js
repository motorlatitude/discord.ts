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
var ReactionStore = /** @class */ (function (_super) {
    __extends(ReactionStore, _super);
    function ReactionStore(client) {
        return _super.call(this, client) || this;
    }
    /**
     * Add a new reaction
     * @param ReactionObject
     */
    ReactionStore.prototype.AddReaction = function (ReactionObject) {
        var _this = this;
        this.Add(ReactionObject.Emoji.Name, ReactionObject).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ReactionStore.AddReaction.Store',
            });
        });
    };
    /**
     * Remove a reaction defined by the emoji name
     * @param EmojiName - name of emoji
     */
    ReactionStore.prototype.RemoveReaction = function (EmojiName) {
        var _this = this;
        this.Delete(EmojiName).catch(function (err) {
            _this.Client.logger.write().error({
                message: err,
                service: 'DiscordClient.ReactionStore.RemoveReaction.Store',
            });
        });
    };
    /**
     * Add a new Reaction object if a reaction is not present, otherwise increment count
     * @param ReactionObject - A new reaction
     * @constructor
     */
    ReactionStore.prototype.UpdateReaction = function (ReactionObject) {
        var _this = this;
        var reaction = this.Get(ReactionObject.Emoji.Name);
        if (reaction) {
            reaction.Count += 1;
            this.Replace(ReactionObject.Emoji.Name, reaction).catch(function (err) {
                _this.Client.logger.write().error({
                    message: err,
                    service: 'DiscordClient.ReactionStore.UpdateReaction.Replace.Store',
                });
            });
        }
        else {
            this.AddReaction(ReactionObject);
        }
    };
    ReactionStore.prototype.AsyncFetchAll = function () {
        var reactions = this.GetAll();
        var Output = [];
        for (var _i = 0, reactions_1 = reactions; _i < reactions_1.length; _i++) {
            var react = reactions_1[_i];
            Output.push(react);
        }
        return Output;
    };
    return ReactionStore;
}(Store_1.default));
exports.default = ReactionStore;
