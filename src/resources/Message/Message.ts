import { IDiscordGuildMember, IDiscordMessage, IDiscordUser } from '../../common/types';
import DirectMessageChannel from '../Channel/DirectMessageChannel';
import TextChannel from '../Channel/TextChannel';
import Guild from '../Guild/Guild';
import GuildMember from '../Guild/GuildMember';
import User from '../User/User';

export default class Message {
  public id: string;
  public ChannelId: string;
  public Author: User;
  public Content: string;
  public Timestamp: number;
  public TTS: boolean;
  public MentionEveryone: boolean;
  public Mentions: User[];
  public MentionRoles: string[];
  public Attachments: any[]; // TODO
  public Embeds: any[]; // TODO
  public Pinned: boolean;
  public Type: number; // TODO

  // If Guild Message
  public GuildId?: string;
  public Member?: GuildMember;

  public Channel?: TextChannel | DirectMessageChannel;

  public EditedTimestamp?: number;
  public Reactions?: any[]; // TODO
  public Nonce?: string;
  public WebhookId?: string;
  public Activity?: any; // TODO
  public Application?: any; // TODO

  constructor(MessageObject: IDiscordMessage) {
    this.id = MessageObject.id;
    this.ChannelId = MessageObject.channel_id;
    this.Author = new User(MessageObject.author);
    this.Content = MessageObject.content;
    this.Timestamp = MessageObject.timestamp;
    this.TTS = MessageObject.tts;
    this.MentionEveryone = MessageObject.mention_everyone;
    this.Mentions = [];
    for (const mention of MessageObject.mentions) {
      this.Mentions.push(new User(mention));
    }
    this.MentionRoles = MessageObject.mention_roles;
    this.Attachments = MessageObject.attachments;
    this.Embeds = MessageObject.embeds;
    this.Pinned = MessageObject.pinned;
    this.Type = MessageObject.type;

    this.GuildId = MessageObject.guild_id;
    this.EditedTimestamp = MessageObject.edited_timestamp;
    this.Reactions = MessageObject.reactions;
    this.Nonce = MessageObject.nonce;
    this.WebhookId = MessageObject.webhook_id;
    this.Activity = MessageObject.activity;
    this.Application = MessageObject.application;
  }

  /**
   * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
   * Sets this message as a Direct Message
   * @param Channel - Direct Message Channel that this message is part of
   */
  public SetDirectMessage(Channel: DirectMessageChannel): void {
    this.Channel = Channel;
  }

  /**
   * EITHER SetDirectMessage or SetGuildMessage SHOULD BE CALLED ON MESSAGE CREATION
   * Sets this message as a Text message in a guild
   * @param GuildId - Guild Id of the guild that the message is part of
   * @param MessageGuild - the guild that the message is part of
   * @param Member - guild member of the author
   * @param Channel - the text channel that the message is part of
   */
  public SetGuildMessage(GuildId: string, MessageGuild: Guild, Member: GuildMember, Channel: TextChannel): void {
    this.GuildId = GuildId;
    this.Member = Member;
    this.Channel = Channel;
  }

  /**
   * Resolve Message class to IDiscordMessage
   */
  public Resolve(): IDiscordMessage {
    const ResolvedMentions: IDiscordUser[] = [];
    for (const mention of this.Mentions) {
      ResolvedMentions.push(mention.Resolve());
    }
    const ResolvedMember: IDiscordGuildMember | undefined = this.Member ? this.Member.Resolve() : undefined;
    // WARN make sure when solving above TODOs that they are accurately resolved below
    return {
      activity: this.Activity,
      application: this.Application,
      attachments: this.Attachments,
      author: this.Author.Resolve(),
      channel_id: this.ChannelId,
      content: this.Content,
      edited_timestamp: this.EditedTimestamp,
      embeds: this.Embeds,
      guild_id: this.GuildId,
      id: this.id,
      member: ResolvedMember,
      mention_everyone: this.MentionEveryone,
      mention_roles: this.MentionRoles,
      mentions: ResolvedMentions,
      nonce: this.Nonce,
      pinned: this.Pinned,
      reactions: this.Reactions,
      timestamp: this.Timestamp,
      tts: this.TTS,
      type: this.Type,
      webhook_id: this.WebhookId,
    };
  }
}
