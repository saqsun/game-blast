import type { Sprite } from 'pixi.js';
import { BlastItem } from './blast-item';

export class BlastItemNone extends BlastItem {
    protected $view!: Sprite;

    public constructor() {
        super();
    }

    public onCreate(): this {
        return this;
    }

    public onSpawn(): void {
        //
    }

    public onDispose(): void {
        //
    }

    public async explode(): Promise<void> {
        Promise.resolve();
    }
}
