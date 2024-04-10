import { mono } from '../../../../mono';
import type { MonoType } from '../../../../mono/types';
import { onBlastProcessCompleteCommand } from './on-blast-process-complete-command';
import { onGameStateUpdateCommand } from './on-game-state-update-command';

export const unmapGameActionsCommand = (store: MonoType.IStore): void => {
    mono.command.unmap('Blast:ProcessComplete', onBlastProcessCompleteCommand);
    mono.command.unmap('Game:StateUpdated', onGameStateUpdateCommand);
};
