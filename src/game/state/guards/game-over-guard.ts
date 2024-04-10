import type { MonoType } from '../../../mono/types';
import { GameState } from '../models/game-model';

export const gameOverGuard = (store: MonoType.IStore, state: GameState): boolean => {
    return state === GameState.win || state === GameState.lose;
};
