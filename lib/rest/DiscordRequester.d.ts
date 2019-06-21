import { IDiscordHTTPResponse } from '../common/types';
export default class DiscordRequester {
    token: string;
    host: string;
    constructor(token: string);
    SendRequest(method: string, endpoint: string, data?: any): Promise<IDiscordHTTPResponse>;
    SendUploadRequest(method: string, endpoint: string, data: any, file: any, filename: string): boolean;
}
