import ClientConnection from '../../client/ClientConnection';
import ClientDispatcher from '../../client/ClientDispatcher'
import ChannelEvent from '../../client/Events/ChannelEvent';
import ChannelPinsUpdateEvent from '../../client/Events/ChannelPinsUpdateEvent';
import GuildBanEvent from '../../client/Events/GuildBanEvent';
import GuildEmojisUpdateEvent from '../../client/Events/GuildEmojisUpdateEvent';
import GuildEvent from '../../client/Events/GuildEvent';
import GuildIntegrationEvent from '../../client/Events/GuildIntegrationEvent';
import GuildMemberEvent from '../../client/Events/GuildMemberEvent';
import GuildRoleEvent from '../../client/Events/GuildRoleEvent';
import MessageEvent from '../../client/Events/MessageEvent';
import ReadyEvent from '../../client/Events/ReadyEvent';
import ResumedEvent from '../../client/Events/ResumedEvent';
import DiscordClient from '../../DiscordClient';
import MessageReactionEvent from '../../client/Events/MessageReactionEvent';
import PresenceUpdateEvent from '../../client/Events/PresenceUpdateEvent';
import TypingStartEvent from '../../client/Events/TypingStartEvent';
import UserUpdateEvent from '../../client/Events/UserUpdateEvent';
import VoiceStateEvent from '../../client/Events/VoiceStateEvent';
import VoiceServerUpdateEvent from '../../client/Events/VoiceServerUpdateEvent';
import WebhooksUpdateEvent from '../../client/Events/WebhooksUpdateEvent';

describe('ClientDispatcher', () => {

  let instance: ClientDispatcher;
  
  beforeEach(() => {

    const client = new DiscordClient({token: "DISCORD_TOKEN"});
    const clientConnection = new ClientConnection(client);
    instance = new ClientDispatcher(client, clientConnection)
  });

  afterEach(() => {
    // somin here
  });

  it('Should create a new instance', () => {
    expect(instance).toBeInstanceOf(ClientDispatcher);
  });

  it('Should handle unhandled event gracefully', () => {
    instance.Parse({
      d: {},
      op: 0,
      s: 1,
      t: "COOKIES",
    });
    expect(instance).toBeInstanceOf(ClientDispatcher);
  });

  it('READY: Should create new ReadyEvent class and call Handle', () => {
    const spy = jest.spyOn(ReadyEvent.prototype, "Handle");
    instance.Parse({
      d: {
        _trace: ["string"],
        guilds: [],
        private_channels: [],
        session_id: "SESSION_ID",
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        },
        v: 6
      },
      op: 0,
      s: 1,
      t: "READY",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('RESUMED: Should create new ResumedEvent class and call Handle', () => {
    const spy = jest.spyOn(ResumedEvent.prototype, "Handle");
    instance.Parse({
      d: {
        _trace: ["string"]
      },
      op: 0,
      s: 1,
      t: "RESUMED",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('CHANNEL_CREATE: Should create new ChannelEvent class and call Handle', () => {
    const spy = jest.spyOn(ChannelEvent.prototype, "HandleCreate");
    instance.Parse({
      d: {
        id: "CHANNEL_ID",
        type: 0
      },
      op: 0,
      s: 1,
      t: "CHANNEL_CREATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('CHANNEL_UPDATE: Should create new ChannelEvent class and call Handle', () => {
    const spy = jest.spyOn(ChannelEvent.prototype, "HandleUpdate");
    instance.Parse({
      d: {
        id: "CHANNEL_ID",
        type: 0
      },
      op: 0,
      s: 1,
      t: "CHANNEL_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('CHANNEL_DELETE: Should create new ChannelEvent class and call Handle', () => {
    const spy = jest.spyOn(ChannelEvent.prototype, "HandleDelete");
    instance.Parse({
      d: {
        id: "CHANNEL_ID",
        type: 0
      },
      op: 0,
      s: 1,
      t: "CHANNEL_DELETE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('CHANNEL_PINS_UPDATE: Should create new ChannelEvent class and call Handle', () => {
    const spy = jest.spyOn(ChannelPinsUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID"
      },
      op: 0,
      s: 1,
      t: "CHANNEL_PINS_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_CREATE: Should create new GuildEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildEvent.prototype, "HandleCreate");
    instance.Parse({
      d: {
        afk_timeout: 0,
        default_message_notifications: 0,
        emojis: [],
        explicit_content_filter: 0,
        features: ["string"],
        id: "GUILD_ID",
        max_members: 10,
        mfa_level: 0,
        name: "GUILD_NAME",
        owner_id: "OWNER_USER_ID",
        premium_tier: 0,
        region: "eu-west",
        roles: [],
        verification_level: 0,
      },
      op: 0,
      s: 1,
      t: "GUILD_CREATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_UPDATE: Should create new GuildEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildEvent.prototype, "HandleUpdate");
    instance.Parse({
      d: {
        afk_timeout: 0,
        default_message_notifications: 0,
        emojis: [],
        explicit_content_filter: 0,
        features: ["string"],
        id: "GUILD_ID",
        max_members: 10,
        mfa_level: 0,
        name: "GUILD_NAME",
        owner_id: "OWNER_USER_ID",
        premium_tier: 0,
        region: "eu-west",
        roles: [],
        verification_level: 0,
      },
      op: 0,
      s: 1,
      t: "GUILD_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_DELETE: Should create new GuildEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildEvent.prototype, "HandleDelete");
    instance.Parse({
      d: {
        id: "GUILD_ID",
        unavailable: true
      },
      op: 0,
      s: 1,
      t: "GUILD_DELETE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_BAN_ADD: Should create new GuildBanEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildBanEvent.prototype, "HandleBanAdd");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_BAN_ADD",
    });
    expect(spy).toHaveBeenCalled();
  });
  
  it('GUILD_BAN_REMOVE: Should create new GuildBanEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildBanEvent.prototype, "HandleBanRemove");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_BAN_REMOVE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_EMOJIS_UPDATE: Should create new GuildBanEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildEmojisUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        emojis: [
          {name: ":)"}
        ],
        guild_id: "GUILD_ID",
      },
      op: 0,
      s: 1,
      t: "GUILD_EMOJIS_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_INTEGRATIONS_UPDATE: Should create new GuildIntegrationsEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildIntegrationEvent.prototype, "Handle");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
      },
      op: 0,
      s: 1,
      t: "GUILD_INTEGRATIONS_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_MEMBER_ADD: Should create new GuildMemberEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildMemberEvent.prototype, "HandleMemberAdd");
    instance.Parse({
      d: {
        deaf: false,
        guild_id: "GUILD_ID",
        joined_at: new Date().getTime(),
        mute: false,
        roles: [],
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_MEMBER_ADD",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_MEMBER_REMOVE: Should create new GuildMemberEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildMemberEvent.prototype, "HandleMemberRemove");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_MEMBER_REMOVE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_MEMBER_UPDATE: Should create new GuildMemberEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildMemberEvent.prototype, "HandleMemberUpdate");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        roles: [],
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_MEMBER_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_MEMBERS_CHUNK: Should create new GuildMemberEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildMemberEvent.prototype, "HandleMemberChunk");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        members:[{
          deaf: false,
          joined_at: new Date().getTime(),
          mute: false,
          roles: [],
          user: {
            avatar: "AVATAR_STRING",
            discriminator: "1234",
            id: "USER_ID",
            username: "USERNAME",
          }
        }]
      },
      op: 0,
      s: 1,
      t: "GUILD_MEMBERS_CHUNK",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_ROLE_CREATE: Should create new GuildRoleEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildRoleEvent.prototype, "HandleRoleCreate");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        role: {
          color: 0,
          hoist: false,
          id: "ROLE_ID",
          managed: false,
          mentionable: true,
          name: "ROLE_NAME",
          permissions: 0,
          position: 0,
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_ROLE_CREATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_ROLE_UPDATE: Should create new GuildRoleEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildRoleEvent.prototype, "HandleRoleUpdate");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        role: {
          color: 0,
          hoist: false,
          id: "ROLE_ID",
          managed: false,
          mentionable: true,
          name: "ROLE_NAME",
          permissions: 0,
          position: 0,
        }
      },
      op: 0,
      s: 1,
      t: "GUILD_ROLE_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('GUILD_ROLE_DELETE: Should create new GuildRoleEvent class and call Handle', () => {
    const spy = jest.spyOn(GuildRoleEvent.prototype, "HandleRoleDelete");
    instance.Parse({
      d: {
        guild_id: "GUILD_ID",
        role: "ROLE_ID"
      },
      op: 0,
      s: 1,
      t: "GUILD_ROLE_DELETE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_CREATE: Should create new MessageEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageEvent.prototype, "HandleMessageCreate");
    instance.Parse({
      d: {
        attachments: [],
        author: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        },
        channel_id: "CHANNEL_ID",
        content: "MESSAGE_CONTENT",
        embeds: [],
        id: "MESSAGE_ID",
        mention_everyone: false,
        mention_roles: [],
        mentions: [],
        pinned: false,
        timestamp: new Date().getTime(),
        tts: false,
        type: 0
      },
      op: 0,
      s: 1,
      t: "MESSAGE_CREATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_UPDATE: Should create new MessageEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageEvent.prototype, "HandleMessageUpdate");
    instance.Parse({
      d: {
        attachments: [],
        author: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        },
        channel_id: "CHANNEL_ID",
        content: "MESSAGE_CONTENT",
        embeds: [],
        id: "MESSAGE_ID",
        mention_everyone: false,
        mention_roles: [],
        mentions: [],
        pinned: false,
        timestamp: new Date().getTime(),
        tts: false,
        type: 0
      },
      op: 0,
      s: 1,
      t: "MESSAGE_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_DELETE: Should create new MessageEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageEvent.prototype, "HandleMessageDelete");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        id: "MESSAGE_ID",
      },
      op: 0,
      s: 1,
      t: "MESSAGE_DELETE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_DELETE_BULK: Should create new MessageEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageEvent.prototype, "HandleMessageDelete");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        ids: [
          "MESSAGE_ID_ONE",
          "MESSAGE_ID_TWO"
        ]
      },
      op: 0,
      s: 1,
      t: "MESSAGE_DELETE_BULK",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_REACTION_ADD: Should create new MessageReactionEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageReactionEvent.prototype, "HandleReactionAdd");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        emoji: {
          id: null,
          name: ":)"
        },
        message_id: "MESSAGE_ID",
        user_id: "USER_ID",
      },
      op: 0,
      s: 1,
      t: "MESSAGE_REACTION_ADD",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_REACTION_REMOVE: Should create new MessageReactionEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageReactionEvent.prototype, "HandleReactionRemove");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        emoji: {
          id: null,
          name: ":)"
        },
        message_id: "MESSAGE_ID",
        user_id: "USER_ID",
      },
      op: 0,
      s: 1,
      t: "MESSAGE_REACTION_REMOVE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('MESSAGE_REACTION_REMOVE_ALL: Should create new MessageReactionEvent class and call Handle', () => {
    const spy = jest.spyOn(MessageReactionEvent.prototype, "HandleReactionRemoveAll");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        message_id: "MESSAGE_ID",
        user_id: "USER_ID",
      },
      op: 0,
      s: 1,
      t: "MESSAGE_REACTION_REMOVE_ALL",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('PRESENCE_UPDATE: Should create new PresenceUpdateEvent class and call Handle', () => {
    const spy = jest.spyOn(PresenceUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        activities: [],
        client_status: {
          desktop: 'online'
        },
        guild_id: "GUILD_ID",
        roles: [],
        status: "online",
        user: {
          avatar: "AVATAR_STRING",
          discriminator: "1234",
          id: "USER_ID",
          username: "USERNAME",
        },
      },
      op: 0,
      s: 1,
      t: "PRESENCE_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('TYPING_START: Should create new TypingStartEvent class and call Handle', () => {
    const spy = jest.spyOn(TypingStartEvent.prototype, "Handle");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        timestamp: new Date().getTime(),
        user_id: "USER_ID",
      },
      op: 0,
      s: 1,
      t: "TYPING_START",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('USER_UPDATE: Should create new UserUpdateEvent class and call Handle', () => {
    const spy = jest.spyOn(UserUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        avatar: "AVATAR_STRING",
        discriminator: "1234",
        id: "USER_ID",
        username: "USERNAME",
      },
      op: 0,
      s: 1,
      t: "USER_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('VOICE_STATE_UPDATE: Should create new VoiceStateEvent class and call Handle', () => {
    const spy = jest.spyOn(VoiceStateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        deaf: false,
        mute: false,
        self_deaf: false,
        self_mute: false,
        session_id: "SESSION_ID",
        suppress: false,
        user_id: "USER_ID",
      },
      op: 0,
      s: 1,
      t: "VOICE_STATE_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('VOICE_SERVER_UPDATE: Should create new VoiceServerUpdateEvent class and call Handle', () => {
    const spy = jest.spyOn(VoiceServerUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        endpoint: "smart.loyal.discord.gg",
        guild_id: "GUILD_ID",
        token: "VOICE_TOKEN",
      },
      op: 0,
      s: 1,
      t: "VOICE_SERVER_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  });

  it('WEBHOOKS_UPDATE: Should create new WebhooksUpdateEvent class and call Handle', () => {
    const spy = jest.spyOn(WebhooksUpdateEvent.prototype, "Handle");
    instance.Parse({
      d: {
        channel_id: "CHANNEL_ID",
        guild_id: "GUILD_ID",
      },
      op: 0,
      s: 1,
      t: "WEBHOOKS_UPDATE",
    });
    expect(spy).toHaveBeenCalled();
  })
});