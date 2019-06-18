// https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
export default {
  DISPATCH: 0,
  HEARTBEAT: 1,
  HEARTBEAT_ACK: 11,
  HELLO: 10,
  IDENTIFY: 2,
  INVALID_SESSION: 9,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  RESUME: 6,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
};
