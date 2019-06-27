import { IGatewayResponse } from '../../../common/types';

export default class GatewayMethods {
  public GatewayForBot(): Promise<IGatewayResponse> {
    return Promise.resolve({
      ping: 0,
      url: 'GATEWAY_URL',
    });
  }
}
