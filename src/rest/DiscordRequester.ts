//Node Modules
import * as req from 'request';

//NPM Modules

//Others
import API_CONSTANTS from './../common/constants/api';
import { DiscordHTTPResponse } from '../common/types';

//Types

export default class DiscordRequester {
  token: string;
  host: string;

  constructor(token: string) {
    this.token = token;
    this.host = API_CONSTANTS.host;
  }

  SendRequest(method: string, endpoint: string, data?: any): Promise<DiscordHTTPResponse> {
    let self = this;
    return new Promise((resolve, reject) => {
      req(
        {
          method: method,
          url: self.host + endpoint,
          headers: {
            Authorization: 'Bot ' + self.token,
          },
          json: true,
          body: data,
        },
        (err, httpResponse, body) => {
          if (httpResponse) {
            const status = httpResponse.statusCode;

            if (err) {
              throw new Error('DiscordRequest Error Occurred');
            } else if (
              status == 400 ||
              status == 401 ||
              status == 403 ||
              status == 404 ||
              status == 405 ||
              status == 502 ||
              status == 500
            ) {
              reject({
                statusCode: status,
                statusMessage: httpResponse.statusMessage,
                httpResponse: httpResponse,
                body: body,
              });
            } else {
              resolve({ httpResponse: httpResponse, body: body });
            }
          } else {
            reject({ statusCode: 500, statusMessage: 'No Response', httpResponse: httpResponse, body: body });
          }
        },
      );
    });
  }

  SendUploadRequest(method: string, endpoint: string, data: any, file: any, filename: string) {}
}
