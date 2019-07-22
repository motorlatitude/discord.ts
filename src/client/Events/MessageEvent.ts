import {
  IDiscordMessage,
  IDiscordMessageDeleteGatewayEvent,
  IDiscordMessageUpdateGatewayEvent,
} from '../../common/types';
import DiscordClient from '../../DiscordClient';
import DirectMessageChannel from '../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../resources/Channel/TextChannel';
import Guild from '../../resources/Guild/Guild';
import GuildMember from '../../resources/Guild/GuildMember';
import Message from '../../resources/Message/Message';
import User from '../../resources/User/User';
import ClientDispatcherEvent from './ClientDispatcherEvent';

export default class MessageEvent extends ClientDispatcherEvent {
  public EventName?: 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE' | 'MESSAGE_DELETE_BULK';
  public EventMessageObject?: Message;
  public EventAuthorObject?: User;
  public EventChannelObject?: TextChannel | DirectMessageChannel;
  public EventGuildObject?: Guild;
  public EventMemberObject?: GuildMember;

  public EventBulkMessageObject?: Message[];

  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Handles MESSAGE_CREATE event
   * @param msg - the created message
   */
  public HandleMessageCreate(
    msg: IDiscordMessage,
  ): Promise<{
    Content: Message;
    Channel: TextChannel | DirectMessageChannel;
    Author: User;
    AffectedGuild?: Guild;
    AffectedGuildMember?: GuildMember;
  }> {
    return new Promise((resolve, reject) => {
      if (msg.guild_id) {
        let AffectedGuild: Guild;
        let AffectedChannel: TextChannel;
        this.Client.Guilds.Fetch(msg.guild_id)
          .then((FoundGuild: Guild) => {
            AffectedGuild = FoundGuild;
            return AffectedGuild.Channels.FetchTextChannel(msg.channel_id);
          })
          .then((FoundChannel: TextChannel) => {
            AffectedChannel = FoundChannel;
            return AffectedGuild.Members.Fetch(msg.author.id);
          })
          .then((AffectedMember: GuildMember) => {
            const NewMessage = new Message(this.Client, msg);
            NewMessage.SetGuildMessage(msg.guild_id as string, AffectedGuild, AffectedMember, AffectedChannel);

            AffectedChannel.Messages.AddMessage(NewMessage);

            this.EventName = 'MESSAGE_CREATE';

            this.EventMessageObject = NewMessage;
            this.EventAuthorObject = NewMessage.Author;
            this.EventGuildObject = AffectedGuild;
            this.EventChannelObject = AffectedChannel;
            this.EventMemberObject = AffectedMember;

            this.Handle();
            resolve({
              AffectedGuild,
              AffectedGuildMember: AffectedMember,
              Author: NewMessage.Author,
              Channel: AffectedChannel,
              Content: NewMessage,
            });
          })
          .catch((err: Error) => {
            reject(err);
          });
      } else {
        // Message is not part of a guild, so DM
        this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
          .then((AffectedChannel: DirectMessageChannel) => {
            const NewMessage = new Message(this.Client, msg);
            NewMessage.SetDirectMessage(AffectedChannel);

            AffectedChannel.Messages.AddMessage(NewMessage);

            this.EventName = 'MESSAGE_CREATE';

            this.EventMessageObject = NewMessage;
            this.EventAuthorObject = NewMessage.Author;
            this.EventChannelObject = AffectedChannel;

            this.Handle();
            resolve({
              Author: NewMessage.Author,
              Channel: AffectedChannel,
              Content: NewMessage,
            });
          })
          .catch((err: Error) => {
            reject(err);
          });
      }
    });
  }

  /**
   * Handles MESSAGE_UPDATE event
   * @param msg - partial message object, must contain id and channel_id and will contain guild_id if message is part of a guild
   */
  public HandleMessageUpdate(
    msg: IDiscordMessageUpdateGatewayEvent,
  ): Promise<{
    Content: Message;
    Channel: TextChannel | DirectMessageChannel;
    Author: User;
    AffectedGuild?: Guild;
    AffectedGuildMember?: GuildMember;
  }> {
    return new Promise((resolve, reject) => {
      if (msg.guild_id) {
        let AffectedGuild: Guild;
        let AffectedChannel: TextChannel;
        this.Client.Guilds.Fetch(msg.guild_id)
          .then((FoundGuild: Guild) => {
            AffectedGuild = FoundGuild;
            return AffectedGuild.Channels.FetchTextChannel(msg.channel_id);
          })
          .then((FoundChannel: TextChannel) => {
            AffectedChannel = FoundChannel;
            return AffectedChannel.Messages.Fetch(msg.id);
          })
          .then((AffectedMessage: Message) => {
            // TODO seems hacky, figure something better out here

            const ResolvedMessage: IDiscordMessage = AffectedMessage.Resolve();

            for (const MessageKey in msg) {
              // @ts-ignore
              if (ResolvedMessage[MessageKey] !== msg[MessageKey]) {
                // @ts-ignore
                ResolvedMessage[MessageKey] = msg[MessageKey];
              }
            }

            const NewMessage = new Message(this.Client, ResolvedMessage);
            NewMessage.SetGuildMessage(
              msg.guild_id as string,
              AffectedGuild,
              AffectedMessage.Member as GuildMember,
              AffectedChannel,
            );

            AffectedChannel.Messages.ReplaceMessage(msg.id, NewMessage);

            this.EventName = 'MESSAGE_UPDATE';
            this.EventMessageObject = NewMessage;
            this.EventChannelObject = AffectedChannel;
            this.EventAuthorObject = NewMessage.Author;
            this.EventGuildObject = AffectedGuild;
            this.EventMemberObject = NewMessage.Member;

            this.Handle();
            resolve({
              AffectedGuild,
              AffectedGuildMember: NewMessage.Member,
              Author: NewMessage.Author,
              Channel: AffectedChannel,
              Content: NewMessage,
            });
          })
          .catch((err: Error) => {
            reject(err);
          });
      } else {
        // Message is not part of a guild, so DM
        let AffectedChannel: DirectMessageChannel;
        this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
          .then((FoundChannel: DirectMessageChannel) => {
            AffectedChannel = FoundChannel;
            return AffectedChannel.Messages.Fetch(msg.id);
          })
          .then((AffectedMessage: Message) => {
            // TODO seems hacky, figure something better out here

            const ResolvedMessage: IDiscordMessage = AffectedMessage.Resolve();

            for (const MessageKey in msg) {
              // @ts-ignore
              if (ResolvedMessage[MessageKey] !== msg[MessageKey]) {
                // @ts-ignore
                ResolvedMessage[MessageKey] = msg[MessageKey];
              }
            }

            const NewMessage = new Message(this.Client, ResolvedMessage);
            NewMessage.SetDirectMessage(AffectedChannel);

            AffectedChannel.Messages.ReplaceMessage(msg.id, NewMessage);

            this.EventName = 'MESSAGE_UPDATE';
            this.EventMessageObject = NewMessage;
            this.EventChannelObject = AffectedChannel;
            this.EventAuthorObject = NewMessage.Author;

            this.Handle();
            resolve({
              Author: NewMessage.Author,
              Channel: AffectedChannel,
              Content: NewMessage,
            });
          })
          .catch((err: Error) => {
            reject(err);
          });
      }
    });
  }

  /**
   * Handles MESSAGE_DELETE and MESSAGE_DELETE_BULK events
   * @param msg - message ids, channel id and guild_id
   */
  public HandleMessageDelete(
    msg: IDiscordMessageDeleteGatewayEvent,
  ): Promise<
    | {
        Content: Message;
        Channel: TextChannel | DirectMessageChannel;
        Author: User;
        AffectedGuild?: Guild;
        AffectedGuildMember?: GuildMember;
      }
    | { Messages: Message[]; Channel: TextChannel | DirectMessageChannel; AffectedGuild?: Guild }
  > {
    return new Promise((resolve, reject) => {
      if (msg.guild_id) {
        let AffectedGuild: Guild;
        this.Client.Guilds.Fetch(msg.guild_id)
          .then((FoundGuild: Guild) => {
            AffectedGuild = FoundGuild;
            return AffectedGuild.Channels.FetchTextChannel(msg.channel_id);
          })
          .then((AffectedChannel: TextChannel) => {
            if (msg.id) {
              AffectedChannel.Messages.Fetch(msg.id)
                .then((AffectedMessage: Message) => {
                  AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);

                  this.EventName = 'MESSAGE_DELETE';

                  this.EventMessageObject = AffectedMessage;
                  this.EventChannelObject = AffectedChannel;
                  this.EventAuthorObject = AffectedMessage.Author;
                  this.EventGuildObject = AffectedGuild;
                  this.EventMemberObject = AffectedMessage.Member;

                  this.Handle();
                  resolve({
                    AffectedGuild,
                    AffectedGuildMember: AffectedMessage.Member,
                    Author: AffectedMessage.Author,
                    Channel: AffectedChannel,
                    Content: AffectedMessage,
                  });
                })
                .catch((err: Error) => {
                  reject(err);
                });
            } else if (msg.ids) {
              AffectedChannel.Messages.FetchAllFor(msg.ids)
                .then((AffectedMessages: Message[]) => {
                  for (const MessageObject of AffectedMessages) {
                    AffectedChannel.Messages.DeleteMessage(MessageObject.id);
                  }
                  this.EventName = 'MESSAGE_DELETE_BULK';

                  this.EventBulkMessageObject = AffectedMessages;
                  this.EventChannelObject = AffectedChannel;
                  this.EventGuildObject = AffectedGuild;

                  this.Handle();
                  resolve({
                    AffectedGuild,
                    Channel: AffectedChannel,
                    Messages: AffectedMessages,
                  });
                })
                .catch((err: Error) => {
                  reject(err);
                });
            } else {
              reject(new Error('A MESSAGE_DELETE or MESSAGE_DELETE_BULK event was sent without id or ids present'));
            }
          })
          .catch((err: Error) => {
            reject(err);
          });
      } else {
        // DM Channel
        this.Client.Channels.FetchDirectMessageChannel(msg.channel_id)
          .then((AffectedChannel: DirectMessageChannel) => {
            if (msg.id) {
              AffectedChannel.Messages.Fetch(msg.id)
                .then((AffectedMessage: Message) => {
                  AffectedChannel.Messages.DeleteMessage(AffectedMessage.id);

                  this.EventName = 'MESSAGE_DELETE';

                  this.EventMessageObject = AffectedMessage;
                  this.EventChannelObject = AffectedChannel;
                  this.EventAuthorObject = AffectedMessage.Author;

                  this.Handle();
                  resolve({
                    Author: AffectedMessage.Author,
                    Channel: AffectedChannel,
                    Content: AffectedMessage,
                  });
                })
                .catch((err: Error) => {
                  reject(err);
                });
            } else if (msg.ids) {
              AffectedChannel.Messages.FetchAllFor(msg.ids)
                .then((AffectedMessages: Message[]) => {
                  for (const MessageObject of AffectedMessages) {
                    AffectedChannel.Messages.DeleteMessage(MessageObject.id);
                  }
                  this.EventName = 'MESSAGE_DELETE_BULK';

                  this.EventBulkMessageObject = AffectedMessages;
                  this.EventChannelObject = AffectedChannel;

                  this.Handle();
                  resolve({
                    Channel: AffectedChannel,
                    Messages: AffectedMessages,
                  });
                })
                .catch((err: Error) => {
                  reject(err);
                });
            }
          })
          .catch((err: Error) => {
            reject(err);
          });
      }
    });
  }

  public EmitEvent(): void {
    if (
      this.EventName === 'MESSAGE_CREATE' ||
      this.EventName === 'MESSAGE_UPDATE' ||
      this.EventName === 'MESSAGE_DELETE'
    ) {
      if (this.EventMessageObject && this.EventChannelObject && this.EventAuthorObject) {
        this.Client.emit(
          this.EventName,
          this.EventMessageObject,
          this.EventChannelObject,
          this.EventAuthorObject,
          this.EventGuildObject,
          this.EventMemberObject,
        );
      }
    } else if (this.EventName === 'MESSAGE_DELETE_BULK') {
      if (this.EventBulkMessageObject && this.EventChannelObject) {
        this.Client.emit(this.EventName, this.EventBulkMessageObject, this.EventChannelObject, this.EventGuildObject);
      }
    }
  }
}
