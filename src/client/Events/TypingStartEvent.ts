import { IDiscordTypingStartGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class TypingStartEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordTypingStartGatewayEvent;

  public readonly EventName: 'TYPING_START' = 'TYPING_START';

  public EventChannelObject?: TextChannel | DirectMessageChannel;
  public EventUserObject?: User;
  public EventTimestampObject?: number;
  public EventGuildObject?: Guild;

  constructor(client: DiscordClient, msg: IDiscordTypingStartGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles TYPING_START event
   */
  public Handle(): void {
    if (this.Message.guild_id) {
      this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
        AffectedGuild.Channels.FetchTextChannel(this.Message.channel_id).then((AffectedChannel: TextChannel) => {
          const AffectedUser: User = AffectedGuild.Members.Get(this.Message.user_id);

          this.EventChannelObject = AffectedChannel;
          this.EventUserObject = AffectedUser;
          this.EventTimestampObject = this.Message.timestamp;
          this.EventGuildObject = AffectedGuild;

          super.Handle();
        });
      });
    } else {
      // DM
      this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(
        (AffectedChannel: DirectMessageChannel) => {
          const AffectedUser: User = AffectedChannel.Recipients.Get(this.Message.user_id);

          this.EventChannelObject = AffectedChannel;
          this.EventUserObject = AffectedUser;
          this.EventTimestampObject = this.Message.timestamp;

          super.Handle();
        },
      );
    }
  }

  public EmitEvent(): void {
    if (this.EventChannelObject && this.EventUserObject && this.EventTimestampObject) {
      this.Client.emit(
        this.EventName,
        this.EventChannelObject,
        this.EventUserObject,
        this.EventTimestampObject,
        this.EventGuildObject,
      );
    }
  }
}
