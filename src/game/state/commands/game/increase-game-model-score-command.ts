import type { MonoType } from '../../../../mono/types';

export const increaseGameModelScoreCommand = (store: MonoType.IStore, score: number): void => {
    store.game.score += score;
};
