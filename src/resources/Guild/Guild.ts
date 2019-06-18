import { IDiscordChannel, IDiscordGuild } from '../../common/types';
import DiscordClient from '../../DiscordClient';
import ChannelStore from '../../stores/ChannelStore';
import TextChannel from '../Channel/TextChannel';
import VoiceChannel from '../Channel/VoiceChannel';

import CHANNEL_TYPES from '../../common/constants/channeltypes';
import CategoryChannel from '../Channel/CategoryChannel';

export default class Guild {

  public id: string;
  public Name: string;
  public OwnerId: string;
  public Region: string;
  public AfkTimeout: number;
  public VerificationLevel: number;
  public DefaultMessageNotification: number;
  public ExplicitContentFilter: number;
  public Roles: any[]; // TODO
  public Emojis: any[]; // TODO
  public Features: string[];
  public MFALevel: number;
  public MaxMembers: number;
  public PremiumTier: number;

  public PremiumSubscriptionCount: number | undefined;
  public Banner: string | undefined;
  public Description: string | undefined;
  public VanityURLCode: string | undefined;
  public MaxPresences: number  | undefined;
  public Presences: any[] | undefined; // TODO
  public Channels: ChannelStore; // TODO
  public Members: any[] | undefined; // TODO
  public VoiceStates: any[] | undefined; // TODO
  public MemberCount: number | undefined;
  public Unavailable: boolean | undefined;
  public Large: boolean | undefined;
  public JoinedAt: number | undefined;
  public SystemChannelId: string | undefined;
  public WidgetChannelId: string | undefined;
  public WidgetEnabled: boolean | undefined;
  public ApplicationId: string | undefined;
  public EmbedChannelId: string | undefined;
  public EmbedEnabled: boolean | undefined;
  public AfkChannelId: string | undefined;
  public Permissions: number | undefined;
  public Owner: boolean | undefined;
  public Icon: string | undefined;
  public Splash: string | undefined;

  private Client: DiscordClient;

  constructor(client: DiscordClient, GuildObject: IDiscordGuild){

    this.Client = client;

    this.id = GuildObject.id;
    this.Name = GuildObject.name;
    this.OwnerId = GuildObject.owner_id;
    this.Region = GuildObject.region;
    this.AfkTimeout = GuildObject.afk_timeout;
    this.VerificationLevel = GuildObject.verification_level;
    this.DefaultMessageNotification = GuildObject.default_message_notifications;
    this.ExplicitContentFilter = GuildObject.explicit_content_filter;
    this.Roles = GuildObject.roles || []; // TODO
    this.Emojis = GuildObject.emojis || []; // TODO
    this.Features = GuildObject.features || [];
    this.MFALevel = GuildObject.mfa_level;
    this.MaxMembers = GuildObject.max_members;
    this.PremiumTier = GuildObject.premium_tier;

    this.PremiumSubscriptionCount = GuildObject.premium_subscription_count;
    this.Banner = GuildObject.banner;
    this.Description = GuildObject.description;
    this.VanityURLCode = GuildObject.vanity_url_code;
    this.MaxPresences = GuildObject.max_presences;
    this.Presences = GuildObject.presences; // TODO
    this.Channels = new ChannelStore(this.Client);
    if(GuildObject.channels){
      this.ResolveChannels(GuildObject.channels);
    }
    this.Members = GuildObject.members; // TODO
    this.VoiceStates = GuildObject.voice_states; // TODO
    this.MemberCount = GuildObject.member_count;
    this.Unavailable = GuildObject.unavailable;
    this.Large = GuildObject.large;
    this.JoinedAt = GuildObject.joined_at;
    this.SystemChannelId = GuildObject.system_channel_id;
    this.WidgetChannelId = GuildObject.widget_channel_id;
    this.WidgetEnabled = GuildObject.widget_enabled;
    this.EmbedChannelId = GuildObject.embed_channel_id;
    this.EmbedEnabled = GuildObject.embed_enabled;
    this.AfkChannelId = GuildObject.afk_channel_id;
    this.Permissions = GuildObject.permissions;
    this.Owner = GuildObject.owner;
    this.Icon = GuildObject.icon;
    this.Splash = GuildObject.splash;

  }


  private ResolveChannels(channels: IDiscordChannel[]): void{
    for(const channel of channels){
      if(channel.type === CHANNEL_TYPES.GUILD_TEXT){
        this.Channels.AddTextChannel(new TextChannel(channel));
      }
      else if(channel.type === CHANNEL_TYPES.GUILD_VOICE){
        this.Channels.AddVoiceChannel(new VoiceChannel(channel));
      }
      else if(channel.type === CHANNEL_TYPES.GUILD_CATEGORY){
        this.Channels.AddChannelCategory(new CategoryChannel(channel));
      }
    }
  }


}