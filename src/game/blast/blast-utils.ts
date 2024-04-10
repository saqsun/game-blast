import type { ItemType } from './blast-constants';
import { ItemTypeMap, RawItemCode, SimpleItemCode, SimpleItemKeys, cellDimension } from './blast-constants';

export const cloneMatrix = <T extends number | string | symbol>(matrix: T[][]): T[][] => {
    const clone: T[][] = [];

    for (const row of matrix) {
        clone.push(row.slice());
    }

    return clone;
};

export const getItemType = (code: ItemCode): ItemType => {
    return ItemTypeMap[code];
};

export const sample = <T>(list: T[]): T => {
    return list[Math.floor(Math.random() * list.length)];
};

export const getRandomSimpleCode = (): ItemCode => {
    return SimpleItemCode[SimpleItemKeys[Math.floor(Math.random() * SimpleItemKeys.length)]];
};

export const isSameGridPoint = (p1: IGridPoint, p2: IGridPoint): boolean => {
    return p1.row === p2.row && p1.col === p2.col;
};

export const isValidPosition = (rows: number, cols: number, row: number, col: number): boolean => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return false;
    }

    return true;
};

export const loopMatrix = <T = any>(matrix: T[][], callback: (row: number, col: number, value: T) => void): void => {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            callback(row, col, matrix[row][col]);
        }
    }
};

export const getDistance = (pt1: IPoint, pt2: IPoint): number => {
    const x = pt1.x - pt2.x;
    const y = pt1.y - pt2.y;

    return Math.sqrt(x * x + y * y);
};

export const getDirection = (pt1: IPoint, pt2: IPoint): IPoint => {
    const { abs, sign } = Math;

    const dx = pt2.x - pt1.x;
    const dy = pt2.y - pt1.y;

    return abs(dx) > abs(dy) ? { x: sign(dx), y: 0 } : { x: 0, y: sign(dy) };
};

export const getViewPosition = (pt: IGridPoint): IPoint => {
    const { width, height } = cellDimension;
    const x = pt.col * width;
    const y = pt.row * height;

    return { x, y };
};

export const swap = (grid: IBlastGrid, c1: IBlastCell, c2: IBlastCell): void => {
    const itemFrom = c1.item;
    const itemTo = c2.item;

    grid[c1.row][c1.col] = c2.item.code;
    grid[c2.row][c2.col] = c1.item.code;

    c1.setItem(itemTo);
    c2.setItem(itemFrom);
};

export const swapGrid = (grid: IBlastGrid, r1: number, c1: number, r2: number, c2: number): void => {
    const code1 = grid[r1][c1];
    const code2 = grid[r2][c2];

    grid[r1][c1] = code2;
    grid[r2][c2] = code1;
};

export const getCellsAbove = (cells: IBlastCell[][], pos: IGridPoint): IBlastCell[] => {
    const { row, col } = pos;
    const result: IBlastCell[] = [];

    if (row === 0) {
        return result;
    }

    for (let r = row - 1; r >= 0; r--) {
        const cell = cells[r][col];

        if (cell.isEmpty()) {
            break;
        }

        if (cell.isDisposed()) {
            continue;
        }

        result.push(cell);
    }

    return result;
};

export const getCellAbove = (cells: IBlastCell[][], pos: IGridPoint): IBlastCell | undefined => {
    const { row, col } = pos;

    if (row === 0) {
        return;
    }

    for (let r = row - 1; r >= 0; r--) {
        const cell = cells[r][col];

        if (cell.isEmpty()) {
            continue;
        }

        if (cell.isDisposed()) {
            continue;
        }

        return cell;
    }

    return;
};

export const getIntersectedPoint = (arr1: IGridPoint[], arr2: IGridPoint[]): IGridPoint | undefined => {
    return arr1.find((pt1) => arr2.find((pt2) => isSameGridPoint(pt1, pt2)));
};

export const getMiddlePoint = (arr: IGridPoint[]): IGridPoint | undefined => {
    return arr[Math.floor(arr.length / 2)];
};

export const getIncludePoint = (arr: IGridPoint[], el: IGridPoint): IGridPoint | undefined => {
    return arr.find((el2) => isSameGridPoint(el, el2));
};

export const getIslandFor = (
    grid: IBlastGrid,
    position: IGridPoint,
    matchSize: number,
    visited?: boolean[][],
): IGridPoint[] => {
    const rows = grid.length;
    const cols = grid[0].length;
    visited = visited || grid.map((row) => row.map((_col) => false));
    const code = grid[position.row][position.col];

    if (code === RawItemCode.dispose) {
        return [];
    }

    const points = dfs(grid, position, code, rows, cols, visited);

    return points.length < matchSize ? [] : points;
};

export const getIslands = (grid: IBlastGrid, matchSize: number): IGridPoint[][] => {
    const visited = grid.map((row) => row.map((_col) => false));

    let islands = [];

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            const island = getIslandFor(grid, { row: r, col: c }, matchSize, visited);
            islands.push(island);
        }
    }

    islands = islands.filter((i) => i.length >= matchSize);

    return islands;
};

const dfs = (
    grid: IBlastGrid,
    pos: IGridPoint,
    code: ItemCode,
    rows: number,
    cols: number,
    visited: boolean[][],
): IGridPoint[] => {
    const { row, col } = pos;
    const res: IGridPoint[] = [];

    if (row < 0 || col < 0 || row >= rows || col >= cols || visited[row][col]) {
        return res;
    }

    if (grid[row][col] !== code) {
        return res;
    }

    res.push({ row, col });
    visited[row][col] = true;

    res.push(...dfs(grid, { row: row + 1, col: col }, code, rows, cols, visited));
    res.push(...dfs(grid, { row: row - 1, col: col }, code, rows, cols, visited));
    res.push(...dfs(grid, { row: row, col: col + 1 }, code, rows, cols, visited));
    res.push(...dfs(grid, { row: row, col: col - 1 }, code, rows, cols, visited));

    return res;
};

export const sortPointsFromOrigin = (points: IGridPoint[], origin: IGridPoint): IGridPoint[] => {
    const { row, col } = origin;

    return points.sort((p1, p2) => {
        const d1 = Math.abs(p1.row - row) + Math.abs(p1.col - col);
        const d2 = Math.abs(p2.row - row) + Math.abs(p2.col - col);

        return d1 - d2;
    });
};

export const chunkPointsFromOrigin = (points: IGridPoint[], origin: IGridPoint): IGridPoint[][] => {
    const { row, col } = origin;
    const chunks: IGridPoint[][] = [];

    const sorted = sortPointsFromOrigin(points, origin);

    let chunk: IGridPoint[] = [];
    let prevDistance = 0;

    for (const p of sorted) {
        const distance = Math.abs(p.row - row) + Math.abs(p.col - col);

        if (distance !== prevDistance) {
            chunks.push(chunk);
            chunk = [];
        }

        chunk.push(p);

        prevDistance = distance;
    }

    chunks.push(chunk);

    return chunks;
};
