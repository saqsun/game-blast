import { Quad, gsap } from 'gsap';
import { Rectangle, Sprite } from 'pixi.js';
import { CellType, RawItemCode, ZIndex, cellDimension } from './blast-constants';
import { getViewPosition } from './blast-utils';
import { BlastItemFactory } from './items/blast-item-factory';

export class BlastCell extends Sprite {
    private _gridPosition!: IGridPoint;
    private _item!: IBlastItem;
    private _type!: CellType;
    private _row!: number;
    private _col!: number;

    public constructor() {
        super();
    }

    public get item(): IBlastItem {
        return this._item;
    }

    public get type(): CellType {
        return this._type;
    }

    public get row(): number {
        return this._row;
    }

    public get col(): number {
        return this._col;
    }

    public get gridPosition(): IGridPoint {
        return this._gridPosition;
    }

    public isEmpty(): boolean {
        return this.type === CellType.empty;
    }

    public isSpecial(): boolean {
        return this.item.isSpecial();
    }

    public isSimple(): boolean {
        return this.item.isSimple();
    }

    public isDisposed(): boolean {
        return this.item.isDisposed();
    }

    public isMatchable(): boolean {
        return this.isDynamic() && !this.isDisposed();
    }

    public isDynamic(): boolean {
        return !this.isEmpty();
    }

    public setPos(row: number, col: number): void {
        this._row = row;
        this._col = col;
    }

    public setType(type: CellType): void {
        this._type = type;
    }

    public bringItemToFront(): void {
        this.item.view.zIndex = ZIndex.front;
    }

    public disposeItem(): void {
        this._item.onDispose();
        this.removeChild(this._item.view);

        BlastItemFactory.giveBack(this.item);
        this.setItem(BlastItemFactory.get(RawItemCode.empty));

        this._item.setCode(RawItemCode.dispose);
    }

    public setItem(item: IBlastItem): void {
        item.setGridPosition(this._row, this._col);

        if (item.view) {
            item.setPosition();
            this.parent.addChild(item.view);
            item.view.eventMode = 'none';
        }

        this._item = item;
    }

    public createItem(code: ItemCode): void {
        const item = BlastItemFactory.get(code);
        item.setCode(code);
        item.onSpawn();

        this.setItem(item);
    }

    public build(): void {
        const { row, col } = this;
        const { width, height } = cellDimension;

        this.anchor.set(0.5);
        this.eventMode = 'static';
        this.zIndex = ZIndex.cell;
        this.interactiveChildren = true;
        this.position.set(col * width, row * height);
        this.hitArea = new Rectangle(-width * this.anchor.x, -height * this.anchor.y, width, height);
        this._gridPosition = { row, col };
    }

    public async animateSwap(to: IGridPoint): Promise<void> {
        const { x, y } = getViewPosition(to);

        await gsap.to(this.item.view, {
            pixi: { x, y },
            duration: 0.2,
            ease: Quad.easeOut,
        });
    }

    public async animateFall(from: IGridPoint): Promise<void> {
        const { x, y } = getViewPosition(from);

        await gsap.from(this.item.view, {
            pixi: { x, y },
            duration: 0.25,
            ease: 'blast-single-bounce',
        });
    }

    public async animateExplode(): Promise<void> {
        await this.item.explode();
    }
}
