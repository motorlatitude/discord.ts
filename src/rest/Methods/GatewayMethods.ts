import DiscordRequester from '../DiscordRequester';

import { IGatewayResponse } from '../../common/types';
import HTTP_CONSTANTS from './../../common/constants/http';

export default class GatewayMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  public GatewayForBot(): Promise<IGatewayResponse> {
    return this.GetGateway('/gateway/bot?v=6')
  }

  public GatewayForUser(): Promise<IGatewayResponse> {
    return this.GetGateway('/gateway?v=6')
  }

  private GetGateway(url: string): Promise<IGatewayResponse> {
    return new Promise((resolve, reject) => {
      this.Requester.SendRequest(HTTP_CONSTANTS.GET, url)
        .then(response => {
          resolve({
            ping: response.httpResponse.elapsedTime,
            url: response.body.url,
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
