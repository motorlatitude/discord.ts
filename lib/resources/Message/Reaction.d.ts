import { IDiscordReaction } from '../../common/types';
import ReactionEmoji from './ReactionEmoji';
export default class Reaction {
    Count: number;
    Me: boolean;
    Emoji: ReactionEmoji;
    constructor(ReactionObject: IDiscordReaction);
    Resolve(): IDiscordReaction;
}
