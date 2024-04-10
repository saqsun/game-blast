import type { MonoType } from '../../../../mono/types';

export const decreaseGameModelMovesCommand = (store: MonoType.IStore, moves: number): void => {
    store.game.moves -= moves;
};
