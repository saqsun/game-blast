import gsap from 'gsap';
import { Sprite, Texture } from 'pixi.js';

export class PopupBlocker extends Sprite {
    public constructor({ tint = 0x000000, alpha = 1, interactive = true }) {
        super(Texture.WHITE);
        this.tint = tint;
        this.alpha = alpha;
        this.eventMode = interactive ? 'static' : 'none';
        this.visible = false;
    }

    public async show(): Promise<void> {
        return await new Promise((resolve) => {
            gsap.from(this, {
                pixi: { alpha: 0 },
                duration: 0.2,
                onStart: () => {
                    this.visible = true;
                },
                onComplete: resolve,
            });
        });
    }

    public async hide(): Promise<void> {
        this.visible = false;
        return await new Promise((resolve) => {
            gsap.to(this, {
                pixi: { alpha: 0 },
                duration: 0.2,
                onComplete: () => {
                    this.visible = false;
                    resolve();
                },
            });
        });
    }
}
