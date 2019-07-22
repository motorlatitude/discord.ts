import { IDiscordHTTPResponse } from '../common/types';
export default class DiscordRequester {
    token: string;
    host: string;
    constructor(token: string);
    SendRequest(method: string, endpoint: string, data?: any): Promise<IDiscordHTTPResponse>;
    SendFormRequest(method: string, endpoint: string, data: any, filename: string, file: any): Promise<IDiscordHTTPResponse>;
}
