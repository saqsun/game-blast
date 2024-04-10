import gsap, { Power4 } from 'gsap';
import { BitmapText, Container, NineSlicePlane, Texture } from 'pixi.js';
import { fonts } from '../../../../assets/fonts';
import { textures } from '../../../../assets/textures';
import { mono } from '../../../../mono';

export class ScoreView extends Container {
    private _score: { value: number } = { value: 0 };
    private _value!: gsap.QuickToFunc;

    private _bg!: NineSlicePlane;
    private _label!: BitmapText;

    public constructor() {
        super();
        this._buildBg();
        this._buildLabel();
        this._buildTween();

        const { store } = mono;
        const { game } = store;
        this._score.value = game.score;
        this.setValue(game.score);
    }

    public setValue(value: number): void {
        this._value(value);
    }

    private _buildBg(): void {
        const bg = new NineSlicePlane(Texture.from(textures['ui/bg-score']), 43, 39, 55, 38);
        bg.width = 260;
        bg.height = 79;
        this.addChild((this._bg = bg));
    }

    private _buildLabel(): void {
        const label = new BitmapText('123456', { fontName: fonts.bitmap.MarvinBitmap, fontSize: 40 });
        label.anchor.set(0.5, 0.5);
        label.x = this._bg.width / 2;
        label.y = label.height * 0.8;
        this.addChild((this._label = label));
    }

    private _buildTween(): void {
        this._value = gsap.quickTo(this._score, 'value', {
            duration: 0.6,
            ease: Power4.easeInOut,
            onUpdate: () => {
                this._label.text = `${Math.round(this._score.value)}`;
            },
            onComplete: () => {
                this._label.text = `${this._score.value}`;
            },
        });
    }
}
