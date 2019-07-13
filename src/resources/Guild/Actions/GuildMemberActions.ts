import { IDiscordGuildMember, IDiscordHTTPResponse } from '../../../common/types';
import { IEndpointGuildMemberObject } from '../../../common/types/GuildEndpoint.types';
import DiscordClient from '../../../DiscordClient';
import Guild from '../Guild';

export default class GuildMemberActions {
  private Client: DiscordClient;
  private Guild: Guild;

  constructor(client: DiscordClient, guild: Guild) {
    this.Guild = guild;
    this.Client = client;
  }

  /**
   * Get a specific guild member, this will call the API
   * @param UserId - the user id of the guild member to call
   */
  public GetMember(UserId: string): Promise<IDiscordGuildMember> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .GetGuildMember(this.Guild.id, UserId)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Get all guild members
   * @constructor
   */
  public GetAllMembers(): Promise<IDiscordGuildMember[]> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .ListGuildMembers(this.Guild.id)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Add a new member to this guild
   * @param UserId - the user id of the user to add to the guild
   * @param GuildMemberObject - an object containing member information
   */
  public AddMember(UserId: string, GuildMemberObject: IEndpointGuildMemberObject): Promise<IDiscordGuildMember> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .AddGuildMember(this.Guild.id, UserId, GuildMemberObject)
        .then((Response: IDiscordHTTPResponse) => {
          resolve(Response.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Remove a member from the guild
   * @param UserId - the user id of the member to be removed
   */
  public RemoveMember(UserId: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.Client.DiscordAPIManager.Methods()
        .GuildMethods()
        .RemoveGuildMember(this.Guild.id, UserId)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
