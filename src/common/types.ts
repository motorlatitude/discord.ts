export interface IDiscordClientOptions {
  token: string;
  debug?: string;
}

export interface IDiscordHTTPResponse {
  httpResponse: any;
  body: any;
  statusCode?: number;
  statusMessage?: string;
}

export interface IGatewayResponse {
  url: string;
  ping: number;
}

// Discord Resource Interfaces

export interface IDiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: any[]; // TODO user object
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: number;
}

// Discord Gateway Interfaces

export interface IDefaultDiscordGatewayPackage {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export interface IDiscordHelloPackage {
  heartbeat_interval: number;
  _trace: string[];
}

export interface IDiscordDispatchDataPackage {
  s: number;
  t: string;
  d: any;
}

export interface IUnavailableGuildObject {
  id: string;
  unavailable: boolean;
}

// Discord Gateway Event Interfaces

export interface IReadyGatewayEvent {
  v: number;
  user: any; // TODO user object
  private_channels: [];
  guilds: IUnavailableGuildObject[]; // TODO array of guild objects
  session_id: string;
  _trace: string[];
  shard?: number[];
}

// Discord.ts Events

export interface IReadyEventObject {
  user: any;
}
