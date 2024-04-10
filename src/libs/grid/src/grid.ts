import type { IDestroyOptions } from 'pixi.js';
import { Container } from 'pixi.js';
import { Cell } from './cell';
import { CellScale } from './constants';
import { GridDebugger } from './grid-debugger';
import { GridSettings } from './settings';
import type { ICell, ICellConfig, ICellContent, IGrid, IGridConfig } from './types';
import { Rect, align, fit } from './utils';

export abstract class Grid extends Container implements IGrid {
    private readonly _debugger?: GridDebugger;
    private readonly _cells: ICell[];
    private readonly _area: Rect;

    public constructor() {
        super();

        if (GridSettings.debug) {
            this._debugger = new GridDebugger();
            this.addChild(this._debugger);
        }

        const config = this.getGridConfig();
        this._cells = this._buildCells(config.cells);
        this._area = this._buildArea(config.area);

        this.rebuild(config);
    }

    public get cells(): ICell[] {
        return this._cells;
    }

    public get area(): Rect {
        return this._area;
    }

    public getCell(cellId: string): ICell | undefined {
        return this._cells.find((cell) => cell.name === cellId);
    }

    public destroy(options?: boolean | IDestroyOptions | undefined): void {
        super.destroy(options);

        this._cells.length = 0;
    }

    public rebuild(config?: IGridConfig): void {
        if (this.destroyed) {
            return;
        }

        const { area, cells, debug } = config ?? this.getGridConfig();

        /* area */
        this._area.copyFrom(area);

        /* cells */
        cells.forEach((cellConfig) => {
            const cell = this.getCell(cellConfig.name)!;
            cell.init(cellConfig, area);
            cell.contents.forEach((content) => {
                this._rebuildContent(cell, content);
            });
        });

        this._debugger?.draw(this, debug);
    }

    public attach(cellName: string, content: ICellContent, addChild = true): void {
        addChild && this.addChild(content);

        const cell = this.getCell(cellName);
        if (cell == null) {
            throw new Error(`No cell found with name ${cellName}`);
        }

        content.once('destroyed', () => this.detach(cellName, content));

        cell.addContent(content);
        this._rebuildContent(cell, content);
    }

    public detach(cellName: string, content: ICellContent): void {
        const cell = this.getCell(cellName)!;

        if (!cell.contents.find((c) => c === content)) {
            throw new Error('No cell found with specified content');
        }

        cell.removeContent(content);
        content.off('destroyed');
    }

    private _rebuildContent(cell: ICell, content: ICellContent): void {
        /* reset content */
        this._resetContent(cell, content);

        /* adjust content */
        const bounds = content.getBounds();
        this._scaleContent(cell, content, bounds);
        this._alignContent(cell, content, bounds);
    }

    private _resetContent(cell: ICell, content: ICellContent): void {
        content.position.set(0, 0);

        if (cell.scale !== CellScale.none) {
            content.scale.set(1, 1);
        }
    }

    private _scaleContent(cell: ICell, content: ICellContent, bounds: IRect): void {
        switch (cell.scale) {
            case CellScale.none: {
                //
                break;
            }
            case CellScale.custom: {
                if (content.resize != null) {
                    throw new Error('resize() function does not implemented');
                }
                content.resize!(cell.area.width, cell.area.height);
                break;
            }
            default: {
                const worldScaleX = content.worldTransform.a / content.localTransform.a;
                const worldScaleY = content.worldTransform.d / content.localTransform.d;
                const contentDimensions = {
                    width: bounds.width / worldScaleX,
                    height: bounds.height / worldScaleY,
                };
                const scale = fit(contentDimensions, cell.area, cell.scale);
                content.scale.set(scale.x, scale.y);
            }
        }
    }

    private _alignContent(cell: ICell, content: ICellContent, bounds: IRect): void {
        const worldScaleX = content.worldTransform.a / content.localTransform.a;
        const worldScaleY = content.worldTransform.d / content.localTransform.d;
        const contentDimensions = {
            width: (bounds.width / worldScaleX) * content.scale.x,
            height: (bounds.height / worldScaleY) * content.scale.y,
        };
        const pos = align(contentDimensions, cell.area, cell.align);
        content.position.set(pos.x, pos.y);
        content.x -= (bounds.x / worldScaleX) * content.scale.x;
        content.y -= (bounds.y / worldScaleY) * content.scale.y;
    }

    private _buildArea(rawArea: IRect): Rect {
        return new Rect().copyFrom(rawArea);
    }

    private _buildCells(rawCells: ICellConfig[]): ICell[] {
        const cells: ICell[] = new Array(rawCells.length);

        rawCells.forEach((cell, i) => (cells[i] = new Cell(cell.name)));

        return cells;
    }

    public abstract getGridConfig(): IGridConfig;
    // public abstract init(): void;
}
