import { Container, Graphics, NineSlicePlane, Rectangle, Texture } from 'pixi.js';
import { textures } from '../../assets/textures';
import { BlastCell } from './blast-cell';
import { CellType, RawItemCode } from './blast-constants';
import { isValidPosition, loopMatrix } from './blast-utils';

export class BlastBoard extends Container {
    private static readonly _bgOversize = 110;
    public readonly cells: IBlastCell[][] = [];
    public readonly grid: IBlastGrid = [];
    public readonly rows: number;
    public readonly cols: number;

    private _bg!: NineSlicePlane;
    private _locked!: boolean;
    private _cellsContainer!: Container;
    private _spawnPoints = new Map<number, IGridPoint>();

    public constructor(private readonly _blast: IBlast) {
        super();

        this._buildCells();

        this._buildBg();
        this._buildMask();

        this.rows = this.grid.length;
        this.cols = this.grid[0].length;

        this._blast.addChild(this);
        this._blast.emitter.on('Action:Move', this._onMove, this);
        this._blast.emitter.on('Hint:NoMovesFound', this._noMovesFound, this);
    }

    public get spawnPoints(): Map<number, IGridPoint> {
        return this._spawnPoints;
    }

    public calculateBounds(): void {
        this._bounds.clear();
        this._bg.calculateBounds();
        this._bounds.addBounds(this._bg._bounds);
    }

    public isLocked(): boolean {
        return this._locked;
    }

    public isSpecial(pos: IGridPoint): boolean {
        return this.cells[pos.row][pos.col].isSpecial();
    }

    public isSimple(pos: IGridPoint): boolean {
        return this.cells[pos.row][pos.col].isSimple();
    }

    public getCell(row: number, col: number): IBlastCell | undefined {
        if (!isValidPosition(this.rows, this.cols, row, col)) {
            return undefined;
        }

        return this.cells[row][col];
    }

    public setLock(value: boolean): void {
        this._locked = value;
        this._cellsContainer.interactiveChildren = !value;
    }

    public updateGrid(): void {
        loopMatrix(this.cells, (row, col, cell) => (this.grid[row][col] = cell.item.code));
    }

    public processMatches(matches: IMatchResult[]): void {
        this._disposeMatchedItems(matches);
    }

    public getNeighbors(pos: IGridPoint, filter: (cell: IBlastCell) => boolean): IBlastCell[] {
        const { row, col } = pos;
        const neighbors: IBlastCell[] = [];

        const left = this.getCell(row - 1, col);
        const up = this.getCell(row, col - 1);
        const right = this.getCell(row + 1, col);
        const down = this.getCell(row, col + 1);

        left && neighbors.push(left);
        up && neighbors.push(up);
        right && neighbors.push(right);
        down && neighbors.push(down);

        return neighbors.filter(filter);
    }

    public spawnComboItems(matches: IMatchResult[]): void {
        matches.forEach((match) => {
            const { combo } = match;

            if (combo == null) {
                return;
            }

            const { code, center } = combo;
            this._createItem(center, code);
        });
    }

    private _disposeMatchedItems(matches: IMatchResult[]): void {
        matches.forEach((match) => {
            match.points.forEach((point) => {
                const { row, col } = point;
                const cell = this.cells[row][col];
                if (cell.isDisposed()) {
                    console.warn('double match: ', row, col);
                    return;
                }
                this._disposeItem(point);
            });
        });
    }

    private _createItem(pos: IGridPoint, code: ItemCode): void {
        const { row, col } = pos;

        const cell = this.cells[row][col];
        cell.createItem(code);
        this.grid[row][col] = cell.item.code; // optimal
    }

    private _disposeItem(pos: IGridPoint): void {
        const { row, col } = pos;

        const cell = this.cells[row][col];
        cell.disposeItem();
        this.grid[row][col] = RawItemCode.dispose;
    }

    private _noMovesFound(): void {
        this.setLock(true);
    }

    private async _onMove(action: IMoveAction): Promise<void> {
        const matches = this._blast.matcher.getMatchesByTap(this.grid, action);

        this.setLock(true);

        matches.length
            ? //
              await this._tapAccept(action, matches)
            : await this._tapReject(action);
    }

    private async _tapReject(action: IMoveAction): Promise<void> {
        this._blast.emitter.emit('Action:TapReject', action);
    }

    private async _tapAccept(action: IMoveAction, matches: IMatchResult[]): Promise<void> {
        this._blast.emitter.emit('Action:TapAccept', action, matches);

        this._blast.emitter.emit('Process:Start', matches);
        await this._blast.process.start(matches);

        this.setLock(false);
        this._blast.emitter.emit('Process:Complete', matches);
    }

    private _bringToFront(cell: IBlastCell): void {
        cell.bringItemToFront();
    }

    private _buildCells(): void {
        this._cellsContainer = new Container();
        this._cellsContainer.sortableChildren = true;
        this.addChild(this._cellsContainer);

        const { grid } = this._blast.config.board;

        for (let r = grid.length - 1; r >= 0; r--) {
            this.grid[r] = [];
            this.cells[r] = [];

            for (let c = 0; c < grid[r].length; c++) {
                const itemCode = grid[r][c];

                const cell = new BlastCell();
                this._cellsContainer.addChild(cell);

                cell.setPos(r, c);
                cell.setType(itemCode === RawItemCode.empty ? CellType.empty : CellType.common);
                cell.createItem(itemCode);
                cell.build();

                this.cells[r].push(cell);
                this.grid[r][c] = itemCode;
                this._cellsContainer.addChild(cell);
            }
        }

        // Calculates spawn points
        for (let c = 0; c < grid[0].length; c++) {
            const point = { row: -1, col: c };
            this._spawnPoints.set(c, point);

            for (let r = 0; r < grid.length; r++) {
                const code = grid[r][c];

                if (code !== RawItemCode.empty) {
                    break;
                }

                point.row = r;
            }
        }
    }

    private _buildBg(): void {
        const { width, height, x, y } = this._cellsContainer.getLocalBounds();
        const bg = new NineSlicePlane(Texture.from(textures['blast/board']), 93, 101, 93, 101);
        bg.x = x - BlastBoard._bgOversize / 2;
        bg.y = y - BlastBoard._bgOversize / 2;
        bg.width = width + BlastBoard._bgOversize;
        bg.height = height + BlastBoard._bgOversize;
        this.addChildAt((this._bg = bg), 0);
    }

    private _buildMask(): void {
        const { width, height, x, y } = this._cellsContainer.getLocalBounds();
        const mask = new Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawShape(new Rectangle(x, y, width, height));
        mask.endFill();
        this.addChild(mask);
        this._cellsContainer.mask = mask;
    }
}
