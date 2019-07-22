import { IDiscordPartialEmoji } from '../../common/types';
export default class ReactionEmoji {
    id?: string;
    Name: string;
    constructor(ReactionEmojiObject: IDiscordPartialEmoji);
    Resolve(): IDiscordPartialEmoji;
}
