import { Server } from 'ws';
import * as zlib from "zlib";
import ClientConnection from '../../client/ClientConnection';
import DiscordClient from '../../DiscordClient';

/**
 * Tests Initialisation
 */

describe('ClientConnection', () => {
  let instance: ClientConnection;
  beforeEach(() => {
    // before
    const client = new DiscordClient({token: "DISCORD_TOKEN"});
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

  it('Should Not Send Payload if Websocket is not ready or available and return false',  () => {
    expect(instance.send(0, new Date().getTime())).toEqual(false);
  })

});



/**
 * Test WebSocket Driven Things
 */
describe('ClientConnection WebSocket', () => {

  let LocalWebSocket: Server;
  let instance: ClientConnection;

  beforeEach(() => {
    // create a WS instance, listening on port 80 on localhost
    LocalWebSocket = new Server({
      port: 4005
    });
    const client = new DiscordClient({token: "DISCORD_TOKEN"});
    instance = new ClientConnection(client);
  });

  afterEach(() => {
    LocalWebSocket.close();
  });

  it('Should Return True When Valid URL Passed', () => {
    expect(instance.Connect("ws://localhost:4005")).toEqual(true)
  });

  it('Should Connect To WS', async (done) => {
    LocalWebSocket.on("connection", (ws) => {
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

  it('Should Send Presence Update', async (done) => {
    LocalWebSocket.on("connection", (ws) => {

      ws.on("message", (message) => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if(data.op === 2){
          // instance is ready to receive
          instance.SetStatus("Hi", 2, 'idle')
        }
        else if(data.op === 3){
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(JSON.stringify({
        d: {
          _trace: ["string"],
          heartbeat_interval: 45000
        },
        op: 10
      }))

    });
    instance.Connect("ws://localhost:4005")
  });

  it('Should Connect To WS And Send Identify Payload After HELLO', async (done) => {
    LocalWebSocket.on("connection", (ws) => {

      ws.on("message", (message) => {
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

      ws.send(JSON.stringify({
        d: {
          _trace: ["string"],
          heartbeat_interval: 45000
        },
        op: 10
      }))

    });
    instance.Connect("ws://localhost:4005")
  });

  it('Should Send Voice Join Payload', async (done) => {
    LocalWebSocket.on("connection", (ws) => {

      ws.on("message", (message) => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if(data.op === 2){
          // instance is ready to receive
          instance.JoinVoiceChannel("1234", "1234", false, false);
        }
        else if(data.op === 4){
          expect(data.d.guild_id).toEqual("1234");
          expect(data.d.channel_id).toEqual("1234");
          expect(data.d.self_mute).toEqual(false);
          expect(data.d.self_deaf).toEqual(false);
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(JSON.stringify({
        d: {
          _trace: ["string"],
          heartbeat_interval: 45000
        },
        op: 10
      }))

    });
    instance.Connect("ws://localhost:4005")
  });

  it('Should Send Voice leave Payload', async (done) => {
    LocalWebSocket.on("connection", (ws) => {

      ws.on("message", (message) => {
        let data;
        if (typeof message === 'string') {
          data = JSON.parse(message);
        } else {
          // @ts-ignore
          const extractedData: string = zlib.inflateSync(message).toString();
          data = JSON.parse(extractedData);
        }
        if(data.op === 2){
          // instance is ready to receive
          instance.LeaveVoiceChannel("1234");
        }
        else if(data.op === 4){
          expect(data.d.guild_id).toEqual("1234");
          expect(data.d.channel_id).toEqual(null);
          done();
        }
        // expect(data.op).toEqual(3); // OpCode should equal 3 - Status Update
      });

      ws.send(JSON.stringify({
        d: {
          _trace: ["string"],
          heartbeat_interval: 45000
        },
        op: 10
      }))

    });
    instance.Connect("ws://localhost:4005")
  })

});
