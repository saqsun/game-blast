import { Point } from 'pixi.js';
import { CellAlign, CellScale } from './constants';
import type { ICell, ICellConfig, ICellContent } from './types';
import { Rect } from './utils';

export class Cell implements ICell {
    public readonly name!: string;
    public readonly contents!: ICellContent[];

    private _area!: IRect;
    private _bounds!: IRect;
    private _scale!: CellScale;
    private _align!: CellAlign;

    public constructor(name: string) {
        this.name = name;
        this.contents = [];
    }

    public get area(): IRect {
        return this._area;
    }

    public get bounds(): IRect {
        return this._bounds;
    }

    public get scale(): CellScale {
        return this._scale;
    }

    public get align(): CellAlign {
        return this._align;
    }

    public init(config: ICellConfig, area: IRect): ICell {
        const { bounds, padding, offset, scale, align } = config;

        this._bounds = this._getBounds(bounds, offset, area);
        this._area = this._getArea(padding);
        this._scale = this._getScale(scale);
        this._align = this._getAlign(align);

        return this;
    }

    public addContent(content: ICellContent): void {
        this.contents.push(content);
    }

    public removeContent(content: ICellContent): void {
        this.contents.splice(this.contents.indexOf(content), 1);
    }

    private _getBounds(bounds: IRect, offset: IPoint = new Point(0, 0), area: IRect): Rect {
        const { x: ax, y: ay, width: aw, height: ah } = area;
        const { x: bx, y: by, width: bw, height: bh } = bounds;
        const { x: ox, y: oy } = offset;

        const x = ax + bx * aw + ox;
        const y = ay + by * ah + oy;
        const w = bw * aw;
        const h = bh * ah;

        return new Rect(x, y, w, h);
    }

    private _getArea(padding: IRect = new Rect(0, 0, 1, 1)): Rect {
        const { x: bx, y: by, width: bw, height: bh } = this._bounds;
        const { x: px, y: py, width: pw, height: ph } = padding;

        const x = bx + px * bw;
        const y = by + py * bh;
        const w = bw - (1 - pw) * bw;
        const h = bh - (1 - ph) * bh;

        return new Rect(x, y, w, h);
    }

    private _getScale(scale = CellScale.fit): CellScale {
        return scale;
    }

    private _getAlign(align = CellAlign.center): CellAlign {
        return align;
    }
}
