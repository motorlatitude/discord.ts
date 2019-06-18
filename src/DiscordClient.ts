// Node Modules
import * as events from 'events';

// NPM Modules

// Others
import ClientConnection from './client/ClientConnection';
import Logger from './common/Logger';
import DiscordManager from './rest/DiscordManager';

// Constants
import EVENTS from './common/constants/events';

// Types
import { IDiscordClientOptions, IGatewayResponse } from './common/types';
import ChannelStore from './stores/ChannelStore';

/**
 * @classdesc Represents DiscordClient Class and Entry Point For discord.ts
 */
export default class DiscordClient extends events.EventEmitter {


  public readonly token: string;
  public debug: string = 'verbose';

  public gateway: string | undefined;
  public connected: boolean = false;

  public UserId: string = '';
  public Guilds: any[] = [];
  public Channels: ChannelStore;

  public rest: DiscordManager;
  public connection: ClientConnection | undefined;

  public logger: Logger;

  /**
   * Create DiscordClient Object
   * @param options - pass options, this must include a token
   * @constructs
   */
  constructor(options: IDiscordClientOptions) {
    super();

    this.token = options.token;
    this.debug = options.debug ? options.debug : 'verbose';

    this.logger = new Logger();

    this.Channels = new ChannelStore(this);

    this.rest = new DiscordManager(this.token);
  }

  /**
   * Retrieve Gateway URL and Connect To Discords Gateway Server
   * @public
   * @method
   * @name connect
   * @returns void
   */
  public connect(): void {
    this.rest
      .Methods()
      .GatewayMethods()
      .GatewayForBot()
      .then((response: IGatewayResponse) => {
        const gatewayUrl: string = response.url;
        const ping: number = response.ping;

        this.gateway = gatewayUrl;

        this.logger.write().debug({
          message: 'Gateway Server: ' + gatewayUrl + ' (' + ping + 'ms)',
          service: 'DiscordClient.connect',
        });
        this.emit(EVENTS.GATEWAY_FOUND, gatewayUrl);

        this.EstablishGatewayConnection(gatewayUrl);
      })
      .catch((err: any) => {
        this.logger.write().error({
          message: err,
          service: 'DiscordClient.connect',
        });
        this.emit(EVENTS.DISCONNECT);
      });
  }

  /**
   * Establish a connection to discords gateway server
   * @private
   * @method
   * @name EstablishGatewayConnection
   * @param {string} url - gateway server url
   * @returns void
   */
  private EstablishGatewayConnection(url: string): void {
    this.connection = new ClientConnection(this, this.logger);
    this.connection.connect(url);
  }
}
