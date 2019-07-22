import * as req from 'request';
import { IDiscordHTTPResponse } from '../common/types';
import API_CONSTANTS from './../common/constants/api';

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
            'User-Agent':
              'DiscordBot (https://github.com/motorlatitude/discord.ts, ' +
              require('./../../package.json').version +
              ')',
          },
          json: true,
          method,
          time: true,
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


  public SendFormRequest(method: string, endpoint: string, data: any, filename: string, file: any): Promise<IDiscordHTTPResponse> {
    return new Promise((resolve, reject) => {
      const FormRequest = req(
        {
          headers: {
            Authorization: 'Bot ' + this.token,
            'Content-Type': 'multipart/form-data',
            'User-Agent':
              'DiscordBot (https://github.com/motorlatitude/discord.ts, ' +
              require('./../../package.json').version +
              ')',
          },
          method,
          time: true,
          url: this.host + endpoint,
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
      const Form = FormRequest.form();
      Form.append('file', file, {filename});
      Form.append('payload_json', JSON.stringify(data))
    });
  }
}
