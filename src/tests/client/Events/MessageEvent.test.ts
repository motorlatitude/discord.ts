import ClientDispatcherEvent from '../../../client/Events/ClientDispatcherEvent';
import MessageEvent from '../../../client/Events/MessageEvent';
import DiscordClient from '../../../DiscordClient';
import DirectMessageChannel from '../../../resources/Channel/DirectMessageChannel';
import TextChannel from '../../../resources/Channel/TextChannel';
import Guild from '../../../resources/Guild/Guild';
import GuildMember from '../../../resources/Guild/GuildMember';
import Message from '../../../resources/Message/Message';
import User from '../../../resources/User/User';

describe('MessageEvent Handling', () => {
  let ClientInstance: DiscordClient;

  beforeEach(() => {
    ClientInstance = new DiscordClient({ token: 'DISCORD_TOKEN' });
    // populate channel store with dummy channel
    ClientInstance.Channels.AddDMChannel(
      new DirectMessageChannel(ClientInstance, {
        id: 'CHANNEL_ID',
        type: 1,
      }),
    );
    // populate DM channel with Message
    const pc: DirectMessageChannel = ClientInstance.Channels.Get('CHANNEL_ID');
    const NewDMMessage = new Message(ClientInstance, {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
    NewDMMessage.SetDirectMessage(pc);
    pc.Messages.AddMessage(NewDMMessage);
    // populate store with dummy guild
    ClientInstance.Guilds.AddGuild(
      new Guild(ClientInstance, {
        afk_timeout: 0,
        channels: [
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_ONE',
            type: 0, // GUILD_TEXT
          },
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_TWO',
            type: 2, // GUILD_VOICE
          },
          {
            guild_id: 'GUILD_ID',
            id: 'CHANNEL_ID_THREE',
            type: 4, // GUILD_CATEGORY
          },
        ],
        default_message_notifications: 0,
        emojis: [],
        explicit_content_filter: 0,
        features: [],
        id: 'GUILD_ID',
        max_members: 0,
        members: [
          {
            deaf: false,
            joined_at: new Date().getTime(),
            mute: false,
            roles: ['ROLE_ID'],
            user: {
              avatar: 'AVATAR_STRING',
              discriminator: '1234',
              id: 'USER_ID',
              username: 'USERNAME',
            },
          },
        ],
        mfa_level: 0,
        name: 'GUILD_NAME',
        owner_id: 'OWNER_ID',
        premium_tier: 0,
        region: 'eu-west',
        roles: [
          {
            color: 0,
            hoist: false,
            id: 'ROLE_ID',
            managed: false,
            mentionable: true,
            name: 'ROLE_NAME',
            permissions: 0,
            position: 1,
          },
        ],
        verification_level: 0,
      }),
    );
    const g: Guild = ClientInstance.Guilds.Get('GUILD_ID');
    const c: TextChannel = g.Channels.Get('CHANNEL_ID_ONE');
    // populate GUILD_TEXT with message
    const NewGuildMessage = new Message(ClientInstance, {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      member: {
        deaf: false,
        joined_at: new Date().getTime(),
        mute: false,
        roles: ['ROLE_ID'],
        user: {
          avatar: 'AVATAR_STRING',
          discriminator: '1234',
          id: 'USER_ID',
          username: 'USERNAME',
        },
      },
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
    NewGuildMessage.SetGuildMessage(
      'GUILD_ID',
      g,
      new GuildMember({
        deaf: false,
        joined_at: new Date().getTime(),
        mute: false,
        roles: ['ROLE_ID'],
        user: {
          avatar: 'AVATAR_STRING',
          discriminator: '1234',
          id: 'USER_ID',
          username: 'USERNAME',
        },
      }),
      c,
    );
    c.Messages.AddMessage(NewGuildMessage);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('HandleMessageCreate: GUILD_TEXT: Should Send MESSAGE_CREATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_CREATE',
      (
        Content: Message,
        Channel: TextChannel | DirectMessageChannel,
        Author: User,
        AffectedGuild?: Guild,
        AffectedGuildMember?: GuildMember,
      ) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(TextChannel);
        expect(Author).toBeInstanceOf(User);
        expect(AffectedGuild).toBeInstanceOf(Guild);
        expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageCreate({
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
  });

  it('HandleMessageCreate: GUILD_TEXT: Should reject if invalid GUILD_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'INVALID_GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageCreate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageCreate: GUILD_TEXT: Should reject if invalid CHANNEL_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'INVALID_CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageCreate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageCreate: GUILD_TEXT: Should reject if invalid USER_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'INVALID_USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageCreate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageCreate: DM: Should Send MESSAGE_CREATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_CREATE',
      (Content: Message, Channel: TextChannel | DirectMessageChannel, Author: User) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(DirectMessageChannel);
        expect(Author).toBeInstanceOf(User);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageCreate({
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
  });

  it('HandleMessageUpdate: GUILD_TEXT: Should Send MESSAGE_UPDATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_UPDATE',
      (
        Content: Message,
        Channel: TextChannel | DirectMessageChannel,
        Author: User,
        AffectedGuild?: Guild,
        AffectedGuildMember?: GuildMember,
      ) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(TextChannel);
        expect(Author).toBeInstanceOf(User);
        expect(AffectedGuild).toBeInstanceOf(Guild);
        expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageUpdate({
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
  });

  it('HandleMessageUpdate: GUILD_TEXT: Should reject if invalid GUILD_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'INVALID_GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageUpdate: GUILD_TEXT: Should reject if invalid CHANNEL_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'INVALID_CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageUpdate: GUILD_TEXT: Should reject if invalid MESSAGE_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID_ONE',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      guild_id: 'GUILD_ID',
      id: 'INVALID_MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageUpdate: DM: Should Send MESSAGE_UPDATE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_UPDATE',
      (Content: Message, Channel: TextChannel | DirectMessageChannel, Author: User) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(DirectMessageChannel);
        expect(Author).toBeInstanceOf(User);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageUpdate({
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    });
  });

  it('HandleMessageUpdate: DM: Should reject if invalid CHANNEL_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'INVALID_CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      id: 'MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageUpdate: DM: Should reject if invalid MESSAGE_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      attachments: [],
      author: {
        avatar: 'AVATAR_STRING',
        discriminator: '1234',
        id: 'USER_ID',
        username: 'USERNAME',
      },
      channel_id: 'CHANNEL_ID',
      content: 'MESSAGE_CONTENT',
      embeds: [],
      id: 'INVALID_MESSAGE_ID',
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().getTime(),
      tts: false,
      type: 0,
    };
    await expect(instance.HandleMessageUpdate(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageDelete: GUILD_TEXT: Should Send MESSAGE_DELETE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_DELETE',
      (
        Content: Message,
        Channel: TextChannel | DirectMessageChannel,
        Author: User,
        AffectedGuild?: Guild,
        AffectedGuildMember?: GuildMember,
      ) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(TextChannel);
        expect(Author).toBeInstanceOf(User);
        expect(AffectedGuild).toBeInstanceOf(Guild);
        expect(AffectedGuildMember).toBeInstanceOf(GuildMember);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageDelete({
      channel_id: 'CHANNEL_ID_ONE',
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
    });
  });

  it('HandleMessageDelete: GUILD_TEXT: Should Send MESSAGE_DELETE_BULK event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_DELETE_BULK',
      (Messages: Message[], Channel: TextChannel | DirectMessageChannel, AffectedGuild?: Guild) => {
        expect(Messages[0]).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(TextChannel);
        expect(AffectedGuild).toBeInstanceOf(Guild);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageDelete({
      channel_id: 'CHANNEL_ID_ONE',
      guild_id: 'GUILD_ID',
      ids: ['MESSAGE_ID'],
    });
  });

  it('HandleMessageDelete: GUILD_TEXT: Should reject if invalid GUILD_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      channel_id: 'CHANNEL_ID_ONE',
      guild_id: 'INVALID_GUILD_ID',
      id: 'MESSAGE_ID',
    };
    await expect(instance.HandleMessageDelete(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageDelete: GUILD_TEXT: Should reject if invalid CHANNEL_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      channel_id: 'INVALID_CHANNEL_ID',
      guild_id: 'GUILD_ID',
      id: 'MESSAGE_ID',
    };
    await expect(instance.HandleMessageDelete(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });

  it('HandleMessageDelete: DM: Should Send MESSAGE_DELETE event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on(
      'MESSAGE_DELETE',
      (Content: Message, Channel: TextChannel | DirectMessageChannel, Author: User) => {
        expect(Content).toBeInstanceOf(Message);
        expect(Channel).toBeInstanceOf(DirectMessageChannel);
        expect(Author).toBeInstanceOf(User);
        expect(spyHandle).toHaveBeenCalled();
        done();
      },
    );

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageDelete({
      channel_id: 'CHANNEL_ID',
      id: 'MESSAGE_ID',
    });
  });

  it('HandleMessageDelete: DM: Should Send MESSAGE_DELETE_BULK event with correct types', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    ClientInstance.on('MESSAGE_DELETE_BULK', (Messages: Message[], Channel: TextChannel | DirectMessageChannel) => {
      expect(Messages[0]).toBeInstanceOf(Message);
      expect(Channel).toBeInstanceOf(DirectMessageChannel);
      expect(spyHandle).toHaveBeenCalled();
      done();
    });

    const instance = new MessageEvent(ClientInstance);
    await instance.HandleMessageDelete({
      channel_id: 'CHANNEL_ID',
      ids: ['MESSAGE_ID'],
    });
  });

  it('HandleMessageDelete: DM: Should reject if invalid CHANNEL_ID', async done => {
    const spyHandle = jest.spyOn(ClientDispatcherEvent.prototype, 'Handle');

    const instance = new MessageEvent(ClientInstance);
    const InvalidMessage = {
      channel_id: 'INVALID_CHANNEL_ID',
      id: 'MESSAGE_ID',
    };
    await expect(instance.HandleMessageDelete(InvalidMessage)).rejects.toBeInstanceOf(Error);
    expect(spyHandle).not.toBeCalled();
    done();
  });
});
