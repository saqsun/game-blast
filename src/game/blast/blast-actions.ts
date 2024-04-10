import type { FederatedPointerEvent } from 'pixi.js';
import { loopMatrix } from './blast-utils';

export class BlastActions {
    public constructor(private readonly _blast: IBlast) {
        this._updateInteractive();
    }

    private _updateInteractive(): void {
        const { cells } = this._blast.board;

        loopMatrix(cells, (row, col, cell) => {
            if (!cell.isEmpty()) {
                cell.on('pointerdown', this._onCellDown, this);
            }
        });
    }

    private _onCellDown(event: FederatedPointerEvent): void {
        if (this._blast.board.isLocked()) {
            return;
        }

        const target = event.target as IBlastCell;
        const { row, col } = target!;
        const position: IPoint = { x: col, y: row };

        const cell = this._blast.board.getCell(position.y, position.x)!;

        if (!cell.isMatchable()) {
            return;
        }

        this._blast.emitter.emit('Action:Move', { cell });
    }
}
