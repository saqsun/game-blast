import { Sprite, Texture } from 'pixi.js';
import type { SimpleItemCode } from '../blast-constants';
import { ZIndex, simpleItemConfig } from '../blast-constants';
import { BlastItem } from './blast-item';

export class BlastItemSimple extends BlastItem implements IBlastItemSimple {
    protected $view!: Sprite;

    public constructor() {
        super();
    }

    public onCreate(): this {
        this.$view = Sprite.from(Texture.EMPTY);
        this.$view.anchor.set(0.5);
        this.$view.zIndex = ZIndex.item;

        return this;
    }

    public onSpawn(): void {
        const { frame } = simpleItemConfig[this.code as SimpleItemCode];

        this.$view.visible = true;
        this.$view.texture = Texture.from(`blast/items/${frame}`);
    }

    public onDispose(): void {
        this.$view.visible = false;
    }

    public async explode(): Promise<void> {
        this.$view.visible = false;
    }
}
