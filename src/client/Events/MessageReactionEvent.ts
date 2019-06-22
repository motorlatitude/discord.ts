import { IDiscordMessageReactionGatewayEvent } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import Message from '../../resources/Message/Message';
import Reaction from '../../resources/Message/Reaction';
import ReactionEmoji from '../../resources/Message/ReactionEmoji';
import User from '../../resources/User/User';
import ReactionStore from '../../stores/ReactionStore';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class MessageReactionEvent extends ClientDispatcherEvent {
  public readonly Message: IDiscordMessageReactionGatewayEvent;

  public EventName?: 'MESSAGE_REACTION_ADD' | 'MESSAGE_REACTION_REMOVE' | 'MESSAGE_REACTION_REMOVE_ALL';

  public EventChannelObject?: TextChannel | DirectMessageChannel;
  public EventMessageId?: string;
  public EventEmojiObject?: ReactionEmoji;
  public EventUserObject?: User;
  public EventGuildObject?: Guild;

  constructor(client: DiscordClient, msg: IDiscordMessageReactionGatewayEvent) {
    super(client);

    this.Message = msg;
  }

  /**
   * Handles MESSAGE_REACTION_ADD event
   */
  public HandleReactionAdd(): void {
    if (this.Message.guild_id) {
      this.GetGuildAndChannel().then(([AffectedGuild, AffectedChannel]) => {
        if (this.Message.user_id) {
          AffectedGuild.Members.Fetch(this.Message.user_id).then((AffectedMember: GuildMember) => {
            this.UpdateMessage(AffectedChannel);

            this.EventName = 'MESSAGE_REACTION_ADD';

            this.EventUserObject = AffectedMember.User;
            this.EventChannelObject = AffectedChannel;
            this.EventMessageId = this.Message.message_id;
            this.EventGuildObject = AffectedGuild;

            // ReactionEmoji is separate from a regular emoji and has no methods as of currently but can be used to
            // find the relevant emoji if required
            this.EventEmojiObject = new ReactionEmoji(this.Message.emoji);

            this.Handle();
          });
        }
      });
    } else {
      // DM
      this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(
        (AffectedChannel: DirectMessageChannel) => {
          if (this.Message.user_id) {
            AffectedChannel.Recipients.Fetch(this.Message.user_id).then((AffectedUser: User) => {
              this.UpdateMessage(AffectedChannel);

              this.EventName = 'MESSAGE_REACTION_ADD';

              this.EventUserObject = AffectedUser;
              this.EventChannelObject = AffectedChannel;
              this.EventMessageId = this.Message.message_id;
              this.EventEmojiObject = new ReactionEmoji(this.Message.emoji);

              this.Handle();
            });
          }
        },
      );
    }
  }

  /**
   * Handles MESSAGE_REACTION_REMOVE event
   */
  public HandleReactionRemove(): void {
    if (this.Message.guild_id) {
      this.GetGuildAndChannel().then(([AffectedGuild, AffectedChannel]) => {
        if (this.Message.user_id) {
          AffectedGuild.Members.Fetch(this.Message.user_id).then((AffectedMember: GuildMember) => {
            // We may not have relevant message
            const AffectedMessage: Message | undefined = AffectedChannel.Messages.Get(this.Message.message_id);
            if (AffectedMessage) {
              AffectedMessage.Reactions.RemoveReaction(this.Message.emoji.name);
            }

            this.EventName = 'MESSAGE_REACTION_REMOVE';

            this.EventUserObject = AffectedMember.User;
            this.EventChannelObject = AffectedChannel;
            this.EventMessageId = this.Message.message_id;
            this.EventGuildObject = AffectedGuild;

            // ReactionEmoji is separate from a regular emoji and has no methods as of currently but can be used to
            // find the relevant emoji if required
            this.EventEmojiObject = new ReactionEmoji(this.Message.emoji);

            this.Handle();
          });
        }
      });
    } else {
      // DM
      this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(
        (AffectedChannel: DirectMessageChannel) => {
          if (this.Message.user_id) {
            AffectedChannel.Recipients.Fetch(this.Message.user_id).then((AffectedUser: User) => {
              // We may not have relevant message
              const AffectedMessage: Message | undefined = AffectedChannel.Messages.Get(this.Message.message_id);
              if (AffectedMessage) {
                AffectedMessage.Reactions.RemoveReaction(this.Message.emoji.name);
              }

              this.EventName = 'MESSAGE_REACTION_REMOVE';

              this.EventUserObject = AffectedUser;
              this.EventChannelObject = AffectedChannel;
              this.EventMessageId = this.Message.message_id;
              this.EventEmojiObject = new ReactionEmoji(this.Message.emoji);

              this.Handle();
            });
          }
        },
      );
    }
  }

  public HandleReactionRemoveAll(): void {
    if (this.Message.guild_id) {
      this.GetGuildAndChannel().then(([AffectedGuild, AffectedChannel]) => {
        // We may not have relevant message
        const AffectedMessage: Message | undefined = AffectedChannel.Messages.Get(this.Message.message_id);
        if (AffectedMessage) {
          AffectedMessage.Reactions = new ReactionStore(this.Client);
        }

        this.EventName = 'MESSAGE_REACTION_REMOVE_ALL';

        this.EventChannelObject = AffectedChannel;
        this.EventMessageId = this.Message.message_id;
        this.EventGuildObject = AffectedGuild;

        this.Handle();
      });
    } else {
      // DM
      this.Client.Channels.FetchDirectMessageChannel(this.Message.channel_id).then(
        (AffectedChannel: DirectMessageChannel) => {
          // We may not have relevant message
          const AffectedMessage: Message | undefined = AffectedChannel.Messages.Get(this.Message.message_id);
          if (AffectedMessage) {
            AffectedMessage.Reactions = new ReactionStore(this.Client);
          }

          this.EventName = 'MESSAGE_REACTION_REMOVE_ALL';

          this.EventChannelObject = AffectedChannel;
          this.EventMessageId = this.Message.message_id;

          this.Handle();
        },
      );
    }
  }

  public EmitEvent(): void {
    if (this.EventName === 'MESSAGE_REACTION_ADD' || this.EventName === 'MESSAGE_REACTION_REMOVE') {
      if (this.EventChannelObject && this.EventMessageId && this.EventEmojiObject && this.EventUserObject) {
        this.Client.emit(
          this.EventName,
          this.EventChannelObject,
          this.EventMessageId,
          this.EventEmojiObject,
          this.EventUserObject,
          this.EventGuildObject,
        );
      }
    } else if (this.EventName === 'MESSAGE_REACTION_REMOVE_ALL') {
      if (this.EventChannelObject && this.EventMessageId) {
        this.Client.emit(this.EventName, this.EventChannelObject, this.EventMessageId, this.EventGuildObject);
      }
    }
  }

  private UpdateMessage(AffectedChannel: TextChannel | DirectMessageChannel): void {
    // We may not have relevant message
    const AffectedMessage: Message | undefined = AffectedChannel.Messages.Get(this.Message.message_id);
    if (AffectedMessage && this.Client.User) {
      const NewReaction = new Reaction({
        count: 1,
        emoji: this.Message.emoji,
        me: this.Client.User.id === this.Message.user_id,
      });
      AffectedMessage.Reactions.UpdateReaction(NewReaction);
    }
  }

  private GetGuildAndChannel(): Promise<[Guild, TextChannel]> {
    return new Promise(resolve => {
      this.Client.Guilds.Fetch(this.Message.guild_id as string)
        .then((AffectedGuild: Guild) => {
          AffectedGuild.Channels.FetchTextChannel(this.Message.channel_id)
            .then((AffectedChannel: TextChannel) => {
              resolve([AffectedGuild, AffectedChannel]);
            })
            .catch((err: Error) => {
              this.Client.logger.write().error({
                message: err,
                service: 'ClientDispatcher.Events.MessageReactionEvent.GetGuildAndChannel',
              });
            });
        })
        .catch((err: Error) => {
          this.Client.logger.write().error({
            message: err,
            service: 'ClientDispatcher.Events.MessageReactionEvent.GetGuildAndChannel',
          });
        });
    });
  }
}
