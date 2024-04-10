import { mono } from '../../../../mono';
import type { MonoType } from '../../../../mono/types';
import { decreaseGameModelMovesCommand } from './decrease-game-model-moves-command';
import { increaseGameModelScoreCommand } from './increase-game-model-score-command';

export const onMoveCommand = (store: MonoType.IStore, matches: IMatchResult[]): void => {
    const score = matches.reduce((acc, match) => {
        const { special, points } = match;
        if (special != null) {
            acc += 10;
        }
        acc += points.length;
        return acc;
    }, 0);

    mono.command
        //
        .payload(score)
        .execute(increaseGameModelScoreCommand);

    // mono.command.payload(matches)

    mono.command
        //
        .payload(1)
        .execute(decreaseGameModelMovesCommand);
};
