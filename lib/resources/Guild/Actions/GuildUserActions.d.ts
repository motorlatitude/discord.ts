import GuildAction from './GuildAction';
export default class GuildUserActions extends GuildAction {
    /**
     * Set the current users nickname in this guild
     * @param Nickname - the new nickname to use
     */
    SetNick(Nickname: string): Promise<{
        nick: string;
    }>;
}
