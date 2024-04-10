import type { MonoType } from '../../../mono/types';

export const moveGuard = (store: MonoType.IStore, matches: IMatchResult[]): boolean => {
    return matches.length > 0 && matches[0].points.length > 0;
};
