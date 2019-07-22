import { IDiscordEmoji } from '../../common/types';
import User from '../User/User';
export default class Emoji {
    Name: string;
    id: string;
    Roles?: string[];
    User?: User;
    RequireColons?: boolean;
    Managed?: boolean;
    Animated?: boolean;
    constructor(EmojiObject: IDiscordEmoji);
    Resolve(): IDiscordEmoji;
}
