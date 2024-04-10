import { BitmapText, Container, NineSlicePlane, Texture } from 'pixi.js';
import { fonts } from '../../../../assets/fonts';
import { textures } from '../../../../assets/textures';
import { mono } from '../../../../mono';

export class MovesView extends Container {
    private _bg!: NineSlicePlane;
    private _label!: BitmapText;

    public constructor() {
        super();
        this._buildBg();
        this._buildLabel();

        const { store } = mono;
        const { game } = store;
        this.setValue(game.moves);
    }

    public setValue(value: number): void {
        this._label.text = `${value}`;
    }

    private _buildBg(): void {
        const bg = new NineSlicePlane(Texture.from(textures['ui/bg-moves']), 43, 39, 55, 38);
        bg.width = 260;
        bg.height = 79;
        this.addChild((this._bg = bg));
    }

    private _buildLabel(): void {
        const label = new BitmapText('65', { fontName: fonts.bitmap.MarvinBitmap, fontSize: 40 });
        label.anchor.set(0.5, 0.5);
        label.x = this._bg.width / 2;
        label.y = label.height * 0.8;
        this.addChild((this._label = label));
    }
}
