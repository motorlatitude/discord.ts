import DiscordRequester from '../DiscordRequester';

import { IGatewayResponse } from '../../common/types';
import HTTP_CONSTANTS from './../../common/constants/http';

export default class GatewayMethods {
  public Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  public GatewayForBot(): Promise<IGatewayResponse> {
    return new Promise((resolve, reject) => {
      this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/gateway/bot?v=6')
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

  public GatewayForUser(): Promise<IGatewayResponse> {
    return new Promise((resolve, reject) => {
      this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/gateway?v=6')
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
