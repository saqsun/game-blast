import type { MonoType } from '../../../../mono/types';
import { GameModel } from '../../models/game-model';

export const initializeGameModelCommand = (store: MonoType.IStore): void => {
    store.setGame(new GameModel());
};
