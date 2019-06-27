import { Server } from 'ws';
import WebSocket = require('ws');
import * as zlib from 'zlib';
import ClientConnection from '../client/ClientConnection';
import DiscordClient from '../DiscordClient';

/**
 * Tests Initialisation
 */

describe('ClientConnection', () => {
  let instance: ClientConnection;
  beforeEach(() => {
    // before
    const client = new DiscordClient({ token: 'DISCORD_TOKEN' });
    instance = new ClientConnection(client);
  });

  it('new should create instance', () => {
    expect(instance).toBeInstanceOf(ClientConnection);
  });

  it('Disconnect should not attempt disconnecting if no WebSocket exists', () => {
    expect(instance.Disconnect()).toEqual(false);
  });

  it('Should Not connect and return false if no valid gateway url is provided', () => {
    expect(instance.Connect()).toEqual(false);
  });

  it('Should Not Send Payload if Websocket is not ready or available and return false', () => {
    expect(instance.send(0, new Date().getTime())).toEqual(false);
  });
});

/**
 * Test WebSocket Driven Things
 */
describe('ClientConnection WebSocket', () => {
  let LocalWebSocket: Server;
  let instance: ClientConnection;
  let ActiveWebsocketConnection: WebSocket;

  beforeEach(async (done) => {
    // create a WS instance, listening on port 80 on localhost
    LocalWebSocket = new Server({
      port: 4005,
    });
    const client = new DiscordClient({ token: 'DISCORD_TOKEN' });
    instance = new ClientConnection(client);
      LocalWebSocket.on('connection', ws => {
        ws.on('message', message => {
          let data;
          if (typeof message === 'string') {
            data = JSON.parse(message);
          } else {
            // @ts-ignore
            const extractedData: string = zlib.inflateSync(message).toString();
            data = JSON.parse(extractedData);
          }
          if (data.op === 2) {
            // instance is ready to receive
            ActiveWebsocketConnection = ws;
            done();
          }
        });

        ws.send(
          zlib.deflateSync(
            JSON.stringify({
              d: {
                _trace: ['string'],
                heartbeat_interval: 45000,
              },
              op: 10,
            }),
          ),
        );
      });
      instance.Connect('ws://localhost:4005');
  });

  afterEach(() => {
    instance.Disconnect();
    LocalWebSocket.close();
  });

  it('Should Return True When Valid URL Passed', () => {
    expect(instance.Connect("ws://localhost:4005")).toEqual(true)
  });

  it('Should Connect To WS', async (done) => {
    LocalWebSocket.on("connection", () => {
      done();
    });
    instance.Connect("ws://localhost:4005")
  });

  it('Should Disconnect and Close the Active Connection', async (done) => {
    LocalWebSocket.on("connection", (ws) => {

      ws.on("close", () => {
        // Connection Has been closed
        done();
      });

      instance.Disconnect();
    });
    instance.Connect("ws://localhost:4005")
  });

  it('Should Send Presence Update', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          instance.SetStatus('Hi', 2, 'idle');
        } else if (data.op === 3) {
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(
        JSON.stringify({
          d: {
            _trace: ['string'],
            heartbeat_interval: 45000,
          },
          op: 10,
        }),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  it('Should Connect To WS And Send Identify Payload After HELLO', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        expect(data.op).toEqual(2); // OpCode should equal 2 - Identify Payload
        done();
      });

      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  it('Should Handle Heartbeat_ACK events', async done => {
    let SentAck = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 1) {
          // instance is ready to receive
          if (!SentAck) {
            ws.send(
              JSON.stringify({
                d: {},
                op: 11,
              }),
            );
            SentAck = true;
          } else {
            expect(instance.GatewayPings.length).toEqual(1);
            done();
          }
        }
      });

      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 1000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  }, 10000);

  it('Should Send Voice Join Payload', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          instance.JoinVoiceChannel('1234', '1234', false, false);
        } else if (data.op === 4) {
          expect(data.d.guild_id).toEqual('1234');
          expect(data.d.channel_id).toEqual('1234');
          expect(data.d.self_mute).toEqual(false);
          expect(data.d.self_deaf).toEqual(false);
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  it('Should Send Voice leave Payload', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          instance.LeaveVoiceChannel('1234');
        } else if (data.op === 4) {
          expect(data.d.guild_id).toEqual('1234');
          expect(data.d.channel_id).toEqual(null);
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  // Test takes longer, as have to go through connection flow
  it('Should Try To Resume if Disconnected Unexpectedly', async done => {
    let Closed = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          if (!Closed) {
            Closed = true;
            expect(instance.resuming).toBe(false);
            ws.close();
          }
        } else if (data.op === 6) {
          if (Closed) {
            expect(instance.resuming).toBe(true);
            done();
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 2000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  }, 10000);

  it('Should Start Heartbeat again after Reconnect', async done => {
    let Closed = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          if (!Closed) {
            Closed = true;
            ws.close();
          }
        }
        else if(data.op === 1){
          // Heartbeat received
          if (Closed) {
            done();
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 2000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  }, 10000);

  it('Should handle dispatched RESUMED event', async done => {
    let Closed = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          if (!Closed) {
            Closed = true;
            ws.close();
          }
        }
        else if(data.op === 6){
          // Resume payload received
          if (Closed) {
            ws.send(
              zlib.deflateSync(
                JSON.stringify({
                  d: {
                    _trace: ['string']
                  },
                  op: 0,
                  s: 1,
                  t: 'RESUMED',
                }),
              ),
            );
          }
        }
        else if(data.op === 1){
          if(Closed){
            // Heartbeat after close received
            expect(instance.resuming).toEqual(false);
            done();
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 2000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  }, 10000);

  it('Should Send Heartbeat When Requested', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          ws.send(
            JSON.stringify({
              d: {},
              op: 1,
            }),
          );
        } else if (data.op === 1) {
          done();
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  it('Should Attempt To Reconnect if Gateway Requests Reconnect', async done => {
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          ws.send(
            JSON.stringify({
              d: {},
              op: 7,
            }),
          );
        } else if (data.op === 6) {
          expect(instance.resuming).toBe(true);
          done();
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });

  it('Should Attempt To Do Full Connection Flow if INVALID_SESSION on RESUME', async done => {
    let Closed = false;
    let SentInvalidSession = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          if(!Closed){
            ws.close();
            Closed = true;
          }
          else if(SentInvalidSession){
            done();
          }
        } else if (data.op === 6) {
          if(Closed) {
            ws.send(
              JSON.stringify({
                d: false,
                op: 9,
              }),
            );
            SentInvalidSession = true;
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 45000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  }, 10000);

  it('Should Handle INVALID_SESSION by reconnecting if resumable', async done => {
    let SentInvalidSession = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          ws.send(
            JSON.stringify({
              d: true,
              op: 9,
            }),
          ); // send invalid session opcode 9 with d true, session is resumable
          SentInvalidSession = true;
        } else if (data.op === 6) {
          if(SentInvalidSession){
            done();
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 1000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  },10000);

  it('Should Handle INVALID_SESSION by reconnecting full flow', async done => {
    let SentInvalidSession = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          if(!SentInvalidSession){
            ws.send(
              JSON.stringify({
                d: false,
                op: 9,
              }),
            ); // send invalid session opcode 9 with d true, session is not resumable, should do full connect
            SentInvalidSession = true;
          }
          else{
            done();

          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 1000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  },10000);

  it('Should Handle Unhandled OpCodes gracefully', async done => {
    let SentInvalidOpCode = false;
    LocalWebSocket.on('connection', ws => {
      ws.on('message', message => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if (data.op === 2) {
          // instance is ready to receive
          ws.send(
            JSON.stringify({
              d: {},
              op: 22,
            }),
          );
          SentInvalidOpCode = true;
        } else if (data.op === 1) {
          if(SentInvalidOpCode){
            done();
          }
        }
      });
      ws.send(
        zlib.deflateSync(
          JSON.stringify({
            d: {
              _trace: ['string'],
              heartbeat_interval: 1000,
            },
            op: 10,
          }),
        ),
      );
    });
    instance.Connect('ws://localhost:4005');
  });
});
