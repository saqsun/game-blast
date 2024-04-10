import { ItemType, RawItemCode, SpecialItemCode } from './blast-constants';
import { BlastFilter } from './blast-filters';
import { cloneMatrix, getIslandFor, getItemType, isSameGridPoint } from './blast-utils';

export class BlastMatcher {
    public constructor(private readonly _blast: IBlast) {
        //
    }

    public readonly getMatchesByTap = (grid: IBlastGrid, action: IMoveAction): IMatchResult[] => {
        const clone = cloneMatrix(grid);
        const cell = action.cell;
        const type = getItemType(clone[cell.row][cell.col]);

        const matches =
            type === ItemType.special
                ? this.getSpecialMatchesFor(clone, cell.gridPosition)
                : this.getSimpleMatchFor(clone, cell);

        return matches;
    };

    public readonly getSimpleMatchFor = (grid: IBlastGrid, cell: IBlastCell): IMatchResult[] => {
        const { matchSize } = this._blast.config.matcher;
        const points = getIslandFor(grid, cell, matchSize);
        const match: IMatchResult = { points };

        switch (true) {
            case points.length > 4 && points.length <= 6:
                match.combo = { center: cell, code: SpecialItemCode.radial };
                break;

            case points.length > 6:
                match.combo = { center: cell, code: SpecialItemCode.cross };
                break;
        }

        return [match];
    };

    public readonly getSpecialMatchesFor = (grid: IBlastGrid, cell: IGridPoint): IMatchResult[] => {
        const { row, col } = cell;

        const code = grid[row][col];
        const matches: IMatchResult[] = [];
        let points: IGridPoint[] = [];

        switch (code) {
            case SpecialItemCode.cross:
                points = this._getSpecialCrossMatch(grid, cell);
                break;

            case SpecialItemCode.radial:
                points = this._getSpecialBlastMatch(grid, cell);
                break;

            default:
                throw new Error(`Unknown special code: ${code}`);
        }

        if (!points.length) {
            return matches;
        }

        const specialPoints: IGridPoint[] = points
            //
            .filter((pt) => BlastFilter.specialFilter(grid, pt))
            .filter((pt) => !isSameGridPoint(pt, cell));

        const uniquePoints = points
            //
            .filter((pt) => !specialPoints.includes(pt));

        uniquePoints.forEach(({ row, col }) => {
            grid[row][col] = RawItemCode.dispose;
        });

        matches.push({
            points: uniquePoints,
            special: { code, center: cell },
        });

        specialPoints.forEach((pt) => {
            !BlastFilter.disposeFilter(grid, pt) && matches.push(...this.getSpecialMatchesFor(grid, pt));
        });

        return matches;
    };

    private readonly _getSpecialCrossMatch = (grid: IBlastGrid, cell: IGridPoint): IGridPoint[] => {
        const { row, col } = cell;

        let points: IGridPoint[] = [];

        for (let c = 0; c < grid.length; c++) {
            points.push({ row: c, col });
        }
        for (let r = 0; r < grid[0].length; r++) {
            points.push({ row, col: r });
        }

        points = points
            //
            .filter((point) => BlastFilter.specialMatchFilter(grid, point))
            .filter((point) => !isSameGridPoint(point, cell));

        points.push({ row, col });

        return points;
    };

    private readonly _getSpecialBlastMatch = (grid: IBlastGrid, cell: IGridPoint): IGridPoint[] => {
        const { row: r, col: c } = cell;

        const points: IGridPoint[] = [
            { row: r, col: c },
            { row: r - 2, col: c },
            { row: r - 1, col: c - 1 },
            { row: r - 1, col: c },
            { row: r - 1, col: c + 1 },
            { row: r, col: c - 2 },
            { row: r, col: c - 1 },
            { row: r, col: c + 1 },
            { row: r, col: c + 2 },
            { row: r + 1, col: c - 1 },
            { row: r + 1, col: c },
            { row: r + 1, col: c + 1 },
            { row: r + 2, col: c },
        ];

        return points.filter(
            (point) => BlastFilter.validPointFilter(grid, point) && BlastFilter.specialMatchFilter(grid, point),
        );
    };

    private readonly _getSpecialRowMatch = (grid: IBlastGrid, cell: IGridPoint): IGridPoint[] => {
        const { row } = cell;
        const points: IGridPoint[] = [];

        for (let c = 0; c < grid[0].length; c++) {
            points.push({ row, col: c });
        }

        return points.filter((point) => BlastFilter.specialMatchFilter(grid, point));
    };

    private readonly _getSpecialColMatch = (grid: IBlastGrid, cell: IGridPoint): IGridPoint[] => {
        const { col } = cell;
        const points: IGridPoint[] = [];

        for (let r = 0; r < grid.length; r++) {
            points.push({ row: r, col });
        }

        return points.filter((point) => BlastFilter.specialMatchFilter(grid, point));
    };
}
