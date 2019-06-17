//Node Modules
import * as events from 'events';

//NPM Modules

//Others
import Logger from './common/Logger';
import DiscordManager from './rest/DiscordManager';
import ClientConnection from './client/ClientConnection';

//Constants
import EVENTS from './common/constants/events';

//Types
import { DiscordClientOptions, GatewayResponse } from './common/types';

/**
 * Represents DiscordClient Class and Entry Point For discord.ts
 */
export class DiscordClient extends events.EventEmitter {
  public readonly token: string;
  public debug: string = 'verbose';

  public gateway: string | undefined;
  public connected: boolean = false;

  public UserId: string = '';
  public Guilds: any[] = [];

  private logger: Logger;

  private rest: DiscordManager;
  private connection: ClientConnection | undefined;

  /**
   * Create DiscordClient Object
   * @param options - pass options, this must include a token
   */
  constructor(options: DiscordClientOptions) {
    super();

    this.token = options.token;
    this.debug = options.debug ? options.debug : 'verbose';

    this.logger = new Logger();

    this.rest = new DiscordManager(this.token);
  }

  /**
   * Establish a connection to discords gateway server
   * @param url - gateway server url
   */
  private EstablishGatewayConnection(url: string): void {
    this.connection = new ClientConnection(this, this.logger);
    this.connection.connect(url);
  }

  /**
   * Retrieve Gateway URL and Connect To Discords Gateway Server
   */
  public connect(): void {
    let _this = this;
    this.rest
      .Methods()
      .GatewayMethods()
      .GatewayForBot()
      .then((response: GatewayResponse) => {
        const gatewayUrl: string = response.url;
        const ping: number = response.ping;

        _this.gateway = gatewayUrl;

        _this.logger.write('Gateway Server: ' + gatewayUrl + ' (' + ping + 'ms)');
        _this.emit(EVENTS.GATEWAY_FOUND, gatewayUrl);

        _this.EstablishGatewayConnection(gatewayUrl);
      })
      .catch((err: any) => {
        _this.logger.write('Error Occurred Obtaining Gateway Server', 'error');
        console.log(err);
        _this.emit(EVENTS.DISCONNECT);
      });
  }
}
