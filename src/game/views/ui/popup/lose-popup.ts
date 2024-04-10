import gsap, { Back } from 'gsap';
import { BitmapText, Container, NineSlicePlane, Texture } from 'pixi.js';
import { fonts } from '../../../../assets/fonts';
import { textures } from '../../../../assets/textures';
import type { IGridConfig } from '../../../../libs/grid';
import { getWinPopupGridConfig } from '../../../configs/grid/popup-win-grid-config';
import { AbstractPopup } from './abstract-popup';

class Popup extends Container {
    private _bg!: NineSlicePlane;
    private _label!: BitmapText;

    public constructor() {
        super();
        this._buildBg();
        this._builtLabel();
        this.visible = false;
    }

    public async show(): Promise<void> {
        this.visible = true;
        return await new Promise((resolve) => {
            gsap.from(this, {
                pixi: { alpha: 0, y: '+=200' },
                ease: Back.easeOut.config(1.7),
                delay: 0.1,
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
    }

    private _buildBg(): void {
        const bg = new NineSlicePlane(Texture.from(textures['ui/bg-blue']), 47, 41, 47, 54);
        bg.width = 860;
        bg.height = 900;
        this.addChild((this._bg = bg));
    }

    private _builtLabel(): void {
        const label = new BitmapText('You/\nLost', {
            fontName: fonts.bitmap.MarvinBitmapBig,
            fontSize: 240,
            align: 'center',
            letterSpacing: 4,
            tint: 0xff0000,
        });
        label.anchor.set(0.5, 0.5);
        label.x = this._bg.width / 2;
        label.y = this._bg.height / 2;
        this.addChild((this._label = label));
    }
}

export class LosePopup extends AbstractPopup {
    private _popup!: Popup;
    public constructor() {
        super();

        const { app } = gameblast;
        const { pixi } = app;
        const { stage } = pixi;

        this.parentLayer = stage.popupLayer;
    }

    public getGridConfig(): IGridConfig {
        return getWinPopupGridConfig();
    }

    public async show(): Promise<void> {
        super.show();
        this._buildPopup();
        await this._popup.show();
    }

    private _buildPopup(): void {
        const popup = new Popup();
        this.attach('popup', (this._popup = popup));
    }
}
