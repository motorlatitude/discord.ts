"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Activity = /** @class */ (function () {
    function Activity(ActivityObject) {
        this.Name = ActivityObject.name;
        this.Type = ActivityObject.type;
        this.URL = ActivityObject.url;
        this.Timestamps = ActivityObject.timestamps;
        this.ApplicationId = ActivityObject.application_id;
        this.Details = ActivityObject.details;
        this.State = ActivityObject.state;
        this.Party = ActivityObject.party;
        this.Assets = ActivityObject.assets;
        this.Secrets = ActivityObject.secrets;
        this.Instance = ActivityObject.instance;
        this.Flags = ActivityObject.flags;
    }
    return Activity;
}());
exports.default = Activity;
