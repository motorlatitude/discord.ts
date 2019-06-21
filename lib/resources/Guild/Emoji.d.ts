import { IDiscordEmoji } from '../../common/types';
import User from '../User/User';
export default class Emoji {
    id: string;
    Name: string;
    Roles?: any[];
    User?: User;
    RequireColons?: boolean;
    Managed?: boolean;
    Animated?: boolean;
    constructor(EmojiObject: IDiscordEmoji);
}
