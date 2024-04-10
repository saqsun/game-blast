import { mono } from '../../../../mono';
import type { MonoType } from '../../../../mono/types';
import { gameOverGuard } from '../../guards/game-over-guard';
import type { GameState } from '../../models/game-model';
import { unmapGameActionsCommand } from './unmap-game-actions-command';

export const onGameStateUpdateCommand = (store: MonoType.IStore, state: GameState): void => {
    mono.command
        //
        .payload(state)
        .guard(gameOverGuard)
        .execute(unmapGameActionsCommand);
};
