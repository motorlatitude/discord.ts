import DiscordRequester from '../DiscordRequester';
import { IGatewayResponse } from '../../common/types';
export default class GatewayMethods {
    Requester: DiscordRequester;
    constructor(r: DiscordRequester);
    GatewayForBot(): Promise<IGatewayResponse>;
    GatewayForUser(): void;
}
