export interface DiscordClientOptions {
  token: string;
  debug?: string;
}

export interface DiscordHTTPResponse {
  httpResponse: any;
  body: any;
  statusCode?: number;
  statusMessage?: string;
}

export interface GatewayResponse {
  url: string;
  ping: number;
}

// Discord Gateway Interfaces

export interface DefaultDiscordGatewayPackage {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export interface DiscordHelloPackage {
  heartbeat_interval: number;
  _trace: string[];
}

export interface DiscordDispatchDataPackage {
  s: number;
  t: string;
  d: any;
}

export interface UnavailabeGuildObject {
  id: string;
  unavailable: boolean;
}

//Discord Gateway Event Interfaces

export interface ReadyGatewayEvent {
  v: number;
  user: any; //TODO user object
  private_channels: [];
  guilds: UnavailabeGuildObject[]; //TODO array of guild objects
  session_id: string;
  _trace: string[];
  shard?: number[];
}

// Discord.ts Events

export interface ReadyEventObject {
  user: any;
}
