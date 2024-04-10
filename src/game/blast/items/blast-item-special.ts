import { Sprite, Texture } from 'pixi.js';
import type { SpecialItemCode } from '../blast-constants';
import { ZIndex, specialItemConfig } from '../blast-constants';
import { BlastItem } from './blast-item';

export class BlastItemSpecial extends BlastItem implements IBlastItemSpecial {
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
        const { frame } = specialItemConfig[this.code as SpecialItemCode];

        this.$view.visible = true;
        this.$view.texture = Texture.from(`blast/special/${frame}`);
    }

    public onDispose(): void {
        this.$view.visible = false;
    }

    public async explode(): Promise<void> {
        this.$view.visible = false;
    }
}
