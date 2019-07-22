import ClientConnection from '../../client/ClientConnection';
import DiscordClient from '../../DiscordClient';
import GatewayMethods from '../../rest/Methods/GatewayMethods';

/**
 * Tests Connect and Disconnect Paths
 */
describe('DiscordClient Connection Tests', () => {
  let instance: DiscordClient;

  beforeEach(() => {
    instance = new DiscordClient({ token: 'DISCORD_TOKEN' });
  });

  afterEach(() => {
    // after
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('Connect Should Call Methods in DiscordManager And Get GATEWAY_URL', async done => {
    const SpyGatewayForBot = jest.spyOn(GatewayMethods.prototype, 'GatewayForBot').mockImplementationOnce(() => {
      return Promise.resolve({ url: 'GATEWAY_URL', ping: 0 });
    });

    instance.on('GATEWAY_FOUND', () => {
      expect(instance.gateway).toEqual('GATEWAY_URL');
      expect(SpyGatewayForBot).toHaveBeenCalled();
      done();
    });
    instance.Connect();
  });

  it('Connect Should Call READY event', async done => {
    const SpyGatewayForBot = jest.spyOn(GatewayMethods.prototype, 'GatewayForBot').mockImplementationOnce(() => {
      return Promise.resolve({ url: 'GATEWAY_URL', ping: 0 });
    });
    const SpyClientConnectionConnect = jest.spyOn(ClientConnection.prototype, 'Connect').mockImplementationOnce(() => {
      return instance.emit('READY');
    });

    instance.on('READY', () => {
      expect(instance.gateway).toEqual('GATEWAY_URL');
      expect(SpyGatewayForBot).toHaveBeenCalled();
      expect(SpyClientConnectionConnect).toHaveBeenCalled();
      done();
    });
    instance.Connect();
  });

  it('Connect Should Disconnect if REST fails', async done => {
    const SpyGatewayForBot = jest.spyOn(GatewayMethods.prototype, 'GatewayForBot').mockImplementationOnce(() => {
      return Promise.reject(new Error('Random Reason'));
    });

    instance.on('DISCONNECT', () => {
      expect(SpyGatewayForBot).toHaveBeenCalled();
      done();
    });

    instance.Connect();
  });

  it('Disconnect Should Call DISCONNECT event', async done => {
    const SpyGatewayForBot = jest.spyOn(GatewayMethods.prototype, 'GatewayForBot').mockImplementationOnce(() => {
      return Promise.resolve({ url: 'GATEWAY_URL', ping: 0 });
    });
    const SpyClientConnectionConnect = jest.spyOn(ClientConnection.prototype, 'Connect').mockImplementationOnce(() => {
      return instance.emit('READY');
    });
    const SpyClientConnectionDisconnect = jest
      .spyOn(ClientConnection.prototype, 'Disconnect')
      .mockImplementationOnce(() => {
        return instance.emit('DISCONNECT');
      });

    instance.on('READY', () => {
      instance.Disconnect();
    });
    instance.on('DISCONNECT', () => {
      expect(SpyGatewayForBot).toHaveBeenCalled();
      expect(SpyClientConnectionConnect).toHaveBeenCalled();
      expect(SpyClientConnectionDisconnect).toHaveBeenCalled();
      done();
    });
    instance.Connect();
  });

  it('Should not attempt disconnection if no connection is available', () => {
    ClientConnection.prototype.Disconnect = jest.fn();

    instance.Disconnect();

    expect(ClientConnection.prototype.Disconnect).not.toBeCalled();
  });
});
