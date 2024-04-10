import gsap from 'gsap';
import { BitmapText, Container, Graphics, NineSlicePlane, Texture } from 'pixi.js';
import { fonts } from '../../../../assets/fonts';
import { textures } from '../../../../assets/textures';
import { mono } from '../../../../mono';
import { lp } from '../../../../utils';

export class ProgressbarView extends Container {
    private _progress: { value: number } = { value: 0 };
    private _value!: gsap.QuickToFunc;

    private _bg!: NineSlicePlane;
    private _progressbarBg!: NineSlicePlane;
    private _progressbarFill!: NineSlicePlane;
    private _progressbarFillMask!: Graphics;
    private _label!: BitmapText;

    public constructor() {
        super();
        this._buildBg();
        this._buildProgress();
        this._buildLabel();

        const { store } = mono;
        const { game } = store;
        this._progress.value = game.score / game.targetScore;
    }

    public calculateBounds(): void {
        this._bounds.clear();
        this._bg.calculateBounds();
        this._bounds.addBounds(this._bg._bounds);
    }

    public resize(): void {
        lp(this._resizeBgLandscape, this._resizeBgPortrait).call(this);
        this._resizeProgressBg();
        this._resizeProgressFill();
        this._resizeProgressFillMask();
        this._resizeLabel();
        this._createOrUpdateTween();
        this.setProgress(this._progress.value);
    }

    public setProgress(progress: number): void {
        this._value(progress);
    }

    private _buildBg(): void {
        const bg = new NineSlicePlane(Texture.from(textures['ui/bg-gradient-dark-blue']), 40, 85, 40, 241);
        this.addChild((this._bg = bg));
        //
        this._bg.width = 670;
    }

    private _buildProgress(): void {
        const progress = new NineSlicePlane(Texture.from(textures['ui/bg-porgressbar']), 25, 24, 25, 26);
        this.addChild((this._progressbarBg = progress));

        const progressFill = new NineSlicePlane(Texture.from(textures['ui/fill-porgressbar']), 24, 20, 24, 21);
        this.addChild((this._progressbarFill = progressFill));

        const progressFillMask = new Graphics();
        this._progressbarFill.mask = progressFillMask;
        this.addChild((this._progressbarFillMask = progressFillMask));
    }

    private _buildLabel(): void {
        const label = new BitmapText('Progress', { fontName: fonts.bitmap.MarvinBitmap, fontSize: 40 });
        label.anchor.set(0.5, 0.5);
        this.addChild((this._label = label));
    }

    private _resizeBgLandscape(): void {
        this._bg.height = 214;
    }

    private _resizeBgPortrait(): void {
        this._bg.height = 331;
    }

    private _resizeProgressBg(): void {
        this._progressbarBg.width = this._bg.width - 70;
        this._progressbarBg.x = (this._bg.width - this._progressbarBg.width) / 2;
        this._progressbarBg.y = this._bg.height - this._progressbarBg.height - 35;
    }

    private _resizeProgressFill(): void {
        this._progressbarFill.width = this._progressbarBg.width - 8;
        this._progressbarFill.height = 43;
        this._progressbarFill.x = this._progressbarBg.x + 4;
        this._progressbarFill.y = this._progressbarBg.y + 3;
    }

    private _resizeProgressFillMask(): void {
        this._progressbarFillMask.clear();
        this._progressbarFillMask.beginFill(0xff0000);
        this._progressbarFillMask.drawRoundedRect(
            0,
            0,
            this._progressbarFill.width,
            this._progressbarFill.height,
            this._progressbarFill.height / 2,
        );
        this._progressbarFillMask.endFill();
        this._progressbarFillMask.x = this._progressbarFill.x;
        this._progressbarFillMask.y = this._progressbarFill.y;
    }

    private _resizeLabel(): void {
        this._label.x = this._bg.width / 2;
        this._label.y = this._progressbarBg.y - this._label.height;
    }

    private _createOrUpdateTween(): void {
        const originX = this._progressbarFill.x;
        this._value = gsap.quickTo(this._progress, 'value', {
            duration: 0.5,
            onUpdate: () => {
                this._progressbarFill.x = originX + this._progressbarFill.width * (this._progress.value - 1);
            },
        });
    }
}
