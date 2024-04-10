import { ItemType, RawItemCode } from './blast-constants';
import { getItemType } from './blast-utils';

export class BlastFilter {
    public static validPointFilter(grid: IBlastGrid, point: IGridPoint): boolean {
        const { row, col } = point;

        return !!grid[row]?.[col];
    }

    public static disposeFilter(grid: IBlastGrid, point: IGridPoint): boolean {
        const { row, col } = point;

        return grid[row][col] === RawItemCode.dispose;
    }

    public static typeFilter(grid: IBlastGrid, point: IGridPoint): boolean {
        const { row, col } = point;

        const code = grid[row][col];
        const type = getItemType(code);

        return type === ItemType.simple;
    }

    public static specialFilter(grid: IBlastGrid, point: IGridPoint): boolean {
        const { row, col } = point;

        const code = grid[row][col];
        const type = getItemType(code);

        return type === ItemType.special;
    }

    public static specialMatchFilter(grid: IBlastGrid, point: IGridPoint): boolean {
        const { row, col } = point;

        const code = grid[row][col];
        const type = getItemType(code);

        return type === ItemType.simple || type === ItemType.special;
    }
}
