// Node Modules
import * as req from 'request';

// NPM Modules

// Others
import { IDiscordHTTPResponse } from '../common/types';
import API_CONSTANTS from './../common/constants/api';

// Types

export default class DiscordRequester {
  public token: string;
  public host: string;

  constructor(token: string) {
    this.token = token;
    this.host = API_CONSTANTS.host;
  }

  public SendRequest(method: string, endpoint: string, data?: any): Promise<IDiscordHTTPResponse> {
    const self = this;
    return new Promise((resolve, reject) => {
      req(
        {
          body: data,
          headers: {
            Authorization: 'Bot ' + self.token,
          },
          json: true,
          method,
          url: self.host + endpoint,
        },
        (err, httpResponse, body) => {
          if (httpResponse) {
            const status = httpResponse.statusCode;

            if (err) {
              reject(err);
            } else if (
              status === 400 ||
              status === 401 ||
              status === 403 ||
              status === 404 ||
              status === 405 ||
              status === 502 ||
              status === 500
            ) {
              reject({
                body,
                httpResponse,
                statusCode: status,
                statusMessage: httpResponse.statusMessage,
              });
            } else {
              resolve({ httpResponse, body });
            }
          } else {
            reject({ statusCode: 500, statusMessage: 'No Response', httpResponse, body });
          }
        },
      );
    });
  }

  public SendUploadRequest(method: string, endpoint: string, data: any, file: any, filename: string) {
    return true;
  }
}
