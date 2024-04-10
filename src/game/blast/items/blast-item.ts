import type { Container } from 'pixi.js';
import { ItemType, RawItemCode, cellDimension } from '../blast-constants';
import { getItemType } from '../blast-utils';

export abstract class BlastItem implements IBlastItem {
    private _code!: ItemCode;
    private _type!: ItemType;
    private _row!: number;
    private _col!: number;

    protected abstract $view: Container;

    public constructor() {
        //
    }

    public get view(): Container {
        return this.$view;
    }

    public get type(): ItemType {
        return this._type;
    }

    public get code(): ItemCode {
        return this._code;
    }

    public get row(): number {
        return this._row;
    }

    public get col(): number {
        return this._col;
    }

    public isDisposed(): boolean {
        return this.code === RawItemCode.dispose;
    }

    public isSpecial(): boolean {
        return this.type === ItemType.special;
    }

    public isSimple(): boolean {
        return this.type === ItemType.simple;
    }

    public setGridPosition(row: number, col: number): void {
        this._row = row;
        this._col = col;
    }

    public setPosition(): void {
        const { row, col } = this;
        const { width, height } = cellDimension;

        this.$view.position.set(col * width, row * height);
    }

    public setCode(code: ItemCode): void {
        this._code = code;
        this._type = getItemType(this._code);
    }

    public abstract onCreate(): this;
    public abstract onSpawn(): void;
    public abstract onDispose(): void;

    public abstract explode(): Promise<void>;
}
