import { mono } from '../../../../mono';
import type { MonoType } from '../../../../mono/types';
import { moveGuard } from '../../guards/move-guard';
import { onMoveCommand } from './on-move-command';

export const onBlastProcessCompleteCommand = (store: MonoType.IStore, matches: IMatchResult[]): void => {
    mono.command
        //
        .payload(matches)
        .guard(moveGuard)
        .execute(onMoveCommand);
};
