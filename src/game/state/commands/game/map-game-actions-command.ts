import { mono } from '../../../../mono';
import type { MonoType } from '../../../../mono/types';
import { onBlastProcessCompleteCommand } from './on-blast-process-complete-command';
import { onGameStateUpdateCommand } from './on-game-state-update-command';

export const mapGameActionsCommand = (store: MonoType.IStore): void => {
    mono.command.map('Blast:ProcessComplete', onBlastProcessCompleteCommand);
    mono.command.map('Game:StateUpdated', onGameStateUpdateCommand);
};
