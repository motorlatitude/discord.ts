import { IDiscordGuildEmojiUpdateGatewayEvent, IGuildEmojisUpdateEventObject } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import Emoji from '../../resources/Guild/Emoji';
import Guild from '../../resources/Guild/Guild';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class GuildEmojisUpdateEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordGuildEmojiUpdateGatewayEvent;

  public readonly EventName: 'GUILD_EMOJIS_UPDATE' = 'GUILD_EMOJIS_UPDATE';
  public EventObject?: IGuildEmojisUpdateEventObject;

  constructor(client: DiscordClient, msg: IDiscordGuildEmojiUpdateGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  public Handle(): void {
    this.Client.Guilds.Fetch(this.Message.guild_id).then((AffectedGuild: Guild) => {
      const emojis: Emoji[] = [];
      for (const emoji of this.Message.emojis) {
        const e = new Emoji(emoji);
        emojis.push(e);
        AffectedGuild.Emojis.ReplaceEmoji(emoji.id, e);
      }

      this.EventObject = {
        Emojis: emojis,
        Guild: AffectedGuild,
      };
    });

    super.Handle();
  }

  public EmitEvent(): void {
    if (this.EventName && this.EventObject) {
      this.Client.emit(this.EventName, this.EventObject);
    }
  }
}
