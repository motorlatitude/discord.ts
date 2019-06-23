// https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-opcodes
// tslint:disable:object-literal-sort-keys
export default {
  IDENTIFY: 0, // client
  SELECT_PROTOCOL: 1, // client
  READY: 2, // server
  HEARTBEAT: 3, // client
  SESSION_DESCRIPTION: 4, // server
  SPEAKING: 5, // client and server
  HEARTBEAT_ACK: 6, // server
  RESUME: 7, // client
  HELLO: 8, // server
  RESUMED: 9, // server
  CLIENT_DISCONNECT: 13, // server
};
