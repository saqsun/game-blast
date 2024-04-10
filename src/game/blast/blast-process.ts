import type { BlastBoard } from './blast-board';
import { RawItemCode } from './blast-constants';
import { getCellAbove, getRandomSimpleCode, swap } from './blast-utils';

export class BlastProcess {
    public constructor(private readonly _blast: IBlast) {
        //
    }

    public async start(matches: IMatchResult[]): Promise<void> {
        await this._round(matches);
    }

    private async _round(matches: IMatchResult[]): Promise<void> {
        const { board, effects, emitter } = this._blast;

        emitter.emit('Process:RoundStart');

        //
        await effects.processMatches(matches);
        board.processMatches(matches);

        await Promise.all([
            //
            board.spawnComboItems(matches),
            this._applyGravity(board, matches),
            this._refillGrid(board, matches),
        ]);

        emitter.emit('Process:RoundComplete', matches);
    }

    private async _applyGravity(board: BlastBoard, matches: IMatchResult[]): Promise<void> {
        const { grid, cells, rows, cols } = board;

        const fallPromises: Array<Promise<void>> = [];

        for (let c = 0; c < cols; c++) {
            for (let r = rows - 1; r >= 0; r--) {
                const code = grid[r][c];

                if (code !== RawItemCode.dispose) {
                    continue;
                }

                const cell1 = cells[r][c];
                const cell2 = getCellAbove(cells, cell1.gridPosition);

                if (cell2 != null) {
                    swap(grid, cell1, cell2);

                    fallPromises.push(cell1.animateFall(cell2));
                }
            }
        }

        await Promise.all(fallPromises);
    }

    private async _refillGrid(board: BlastBoard, matches: IMatchResult[]): Promise<void> {
        const { grid, cells, rows, cols } = board;

        const fallPromises: Array<Promise<void>> = [];
        const disposed = new Map<number, IBlastCell[]>();

        for (let c = 0; c < cols; c++) {
            const disposedPerCol: IBlastCell[] = [];

            for (let r = 0; r < rows; r++) {
                const code = grid[r][c];

                if (code === RawItemCode.dispose) {
                    disposedPerCol.push(cells[r][c]);
                }
            }

            disposed.set(c, disposedPerCol);
        }

        disposed.forEach((disposedPerCol, c) => {
            disposedPerCol.reverse().forEach((cell, i) => {
                cell.createItem(getRandomSimpleCode());

                const origin = board.spawnPoints.get(c)!;
                const from = { row: origin.row - i, col: cell.col };
                fallPromises.push(cell.animateFall(from));
            });
        });

        board.updateGrid();

        await Promise.all(fallPromises);
    }
}
