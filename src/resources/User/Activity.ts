import {
  IDiscordActivity,
  IDiscordActivityTimestamp,
  IDiscordAssets,
  IDiscordParty,
  IDiscordSecrets,
} from '../../common/types';

export default class Activity {
  public Name: string;
  public Type: number;

  public URL?: string;
  public Timestamps?: IDiscordActivityTimestamp;
  public ApplicationId?: string;
  public Details?: string;
  public State?: string;
  public Party?: IDiscordParty;
  public Assets?: IDiscordAssets;
  public Secrets?: IDiscordSecrets;
  public Instance?: boolean;
  public Flags?: number;

  constructor(ActivityObject: IDiscordActivity) {
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
}
