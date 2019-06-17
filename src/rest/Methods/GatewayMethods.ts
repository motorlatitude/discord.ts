import DiscordRequester from '../DiscordRequester';

import HTTP_CONSTANTS from './../../common/constants/http';
import { GatewayResponse } from '../../common/types';

export default class GatewayMethods {
  Requester: DiscordRequester;

  constructor(r: DiscordRequester) {
    this.Requester = r;
  }

  GatewayForBot(): Promise<GatewayResponse> {
    let self = this;
    return new Promise((resolve, reject) => {
      self.Requester.SendRequest(HTTP_CONSTANTS.GET, '/gateway/bot?v=6')
        .then(response => {
          resolve({
            url: response.body.url,
            ping: response.httpResponse.elapsedTime,
          });
        })
        .catch(err => {
          console.log(err);
          throw new Error('GatewayMethods Error Occurred: Failed To Obtain Gateway Endpoint');
        });
    });
  }

  GatewayForUser(): void {
    this.Requester.SendRequest(HTTP_CONSTANTS.GET, '/gateway?v=6');
  }
}
