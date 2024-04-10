/* eslint-disable @typescript-eslint/no-empty-interface */

import type { Container } from 'pixi.js';
import type { BlastActions } from '../src/game/blast/blast-actions';
import type { BlastBoard } from '../src/game/blast/blast-board';
import type { BlastCell } from '../src/game/blast/blast-cell';
import type { BlastConfig } from '../src/game/blast/blast-config';
import type { ItemType, RawItemCode, SimpleItemCode, SpecialItemCode } from '../src/game/blast/blast-constants';
import type { BlastDebug } from '../src/game/blast/blast-debug';
import type { BlastEffects } from '../src/game/blast/blast-effects';
import type { BlastEmitter } from '../src/game/blast/blast-emitter';
import type { BlastMatcher } from '../src/game/blast/blast-matcher';
import type { BlastProcess } from '../src/game/blast/blast-process';

export declare global {
    interface IBlast extends Container {
        debug?: BlastDebug;
        board: BlastBoard;
        actions: BlastActions;
        config: BlastConfig;
        process: BlastProcess;
        matcher: BlastMatcher;
        effects: BlastEffects;
        emitter: BlastEmitter;
    }

    interface IGridPoint {
        row: number;
        col: number;
    }

    type IBlastGrid = ItemCode[][];
    type IBlastOrientation = 'horizontal' | 'vertical';

    type ItemCode = SimpleItemCode | SpecialItemCode | RawItemCode;

    interface IBlastConfig {
        process: {
            chained: boolean;
        };
        matcher: {
            matchSize: number;
        };
        actions: {
            //
        };
        stats: {
            //
        };
        hint: {
            idleTime: number;
        };
        board: {
            grid: IBlastGrid;
        };
    }

    type IBlastCell = BlastCell;

    interface IPoolInstance {
        onCreate: () => this;
        onSpawn: () => void;
        onDispose: () => void;
    }

    interface IBlastItem extends IPoolInstance {
        row: number;
        col: number;
        type: ItemType;
        code: ItemCode;
        view: Container;

        setPosition: () => void;
        setGridPosition: (row: number, col: number) => void;
        setCode: (code: ItemCode) => void;

        explode: () => Promise<void>;

        isDisposed(): boolean;
        isSpecial(): boolean;
        isSimple(): boolean;
    }

    type IMatchOrientation = 'horizontal' | 'vertical';
    type IComboMatchShape = IMatchOrientation | 'cross';

    interface IMatchResult {
        points: IGridPoint[];

        combo?: {
            center: IGridPoint;
            code: SpecialItemCode;
        };

        special?: {
            code: SpecialItemCode;
            center: IGridPoint;
        };
    }

    interface IMoveAction {
        cell: IM3Cell;
    }

    interface IHintEntry {
        positions: IGridPoint[];
        count: number;
    }

    interface IBlastItemSimple {
        //
    }

    interface IBlastItemSpecial {
        //
    }

    interface ISimpleItemConfig {
        frame: string;
    }

    interface ISpecialItemConfig {
        frame: string;
    }
}
