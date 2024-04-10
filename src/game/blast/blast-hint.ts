import gsap, { Quad } from 'gsap';
import type { Container } from 'pixi.js';
import type { TickerTask } from '../../app/plugins/ticker/ticker';
import { getIslands, loopMatrix, sample } from './blast-utils';

export class BlastHint {
    private _idleTask?: TickerTask;
    private _hints!: IHintEntry[];
    private _hintTween?: gsap.core.Timeline;

    public constructor(
        private _blast: IBlast,
        private _enabled: boolean,
    ) {
        this._hints = [];

        this._blast.emitter.on('Core:Ready', this._onReady, this);
        this._blast.emitter.on('Action:TapAccept', this._onMoveAccept, this);
        this._blast.emitter.on('Process:Complete', this._onProcessComplete, this);
    }

    public get hints(): IHintEntry[] {
        return this._hints;
    }

    protected set hints(value: IHintEntry[]) {
        this._hints = value;

        if (this._hints.length === 0) {
            this._stopHintIdleTimer();
            this._blast.emitter.emit('Hint:NoMovesFound');
        }
    }

    private _onReady(): void {
        this._calculateHints();
        this._startHintIdleTimer();
    }

    private _onMoveAccept(): void {
        this._removeTweens();
        this._stopHintIdleTimer();
    }

    private _onMoveReject(): void {
        this._resetHintIdleTimer();
    }

    private _onProcessComplete(): void {
        this._calculateHints();
        this._resetHintIdleTimer();
    }

    private _startHintIdleTimer(): void {
        if (!this._enabled) {
            return;
        }

        const { app } = gameblast;
        this._idleTask = app.ticker.addTask({
            delay: this._blast.config.hint.idleTime * 1000,
        });
        this._idleTask.emitter.once('complete', this._onHintIdleTime);
    }

    private _stopHintIdleTimer(): void {
        this._idleTask?.dispose();
    }

    private _resetHintIdleTimer(): void {
        this._stopHintIdleTimer();
        this._startHintIdleTimer();
    }

    private _removeTweens(): void {
        if (this._hintTween == null) {
            return;
        }

        this._hintTween.totalProgress(1, true);
        this._hintTween.kill();
    }

    private readonly _onHintIdleTime = (): void => {
        if (this._hints.length === 0) {
            return;
        }

        const { cells } = this._blast.board;
        const { positions } = this.hints[0];

        this._shakeItems(positions.map((pos) => cells[pos.row][pos.col].item.view));
    };

    private _shakeItems(items: Container[]): void {
        this._hintTween = gsap
            .timeline({
                repeat: -1,
                repeatDelay: 2,
            })
            .add(
                gsap.to(items, {
                    pixi: { scale: '+=0.1' },
                    repeat: 3,
                    yoyo: true,
                    duration: 0.1,
                    ease: Quad.easeInOut,
                }),
            );
    }

    private _calculateHints(): void {
        const specials = this._findSpecialHints();
        const commons = this._findCommonHints();
        let hint: IHintEntry | undefined;

        if (specials.length) {
            const entry = sample(specials);
            hint = { count: 1, positions: [{ row: entry.row, col: entry.col }] };
        } else if (commons.length) {
            const largestIsland = commons.sort((a, b) => b.length - a.length)[0];
            hint = { count: largestIsland.length, positions: largestIsland };
        }

        this.hints = hint ? [hint] : [];
    }

    private _findSpecialHints(): IGridPoint[] {
        const { board } = this._blast;
        const cells = board.cells;
        const hints: IBlastCell[] = [];

        loopMatrix(cells, (row, col, cell) => {
            if (cell.isSpecial()) {
                hints.push(cell);
            }
        });

        return hints;
    }

    private _findCommonHints(): IGridPoint[][] {
        const { board, config } = this._blast;

        return getIslands(board.grid, config.matcher.matchSize);
    }
}
