import { Container, NineSlicePlane, Texture } from 'pixi.js';
import { textures } from '../../../../assets/textures';
import { mono } from '../../../../mono';
import { lp } from '../../../../utils';
import { MovesView } from './moves-view';
import { ProgressbarView } from './progressbar-view';
import { ScoreView } from './score-view';

export class TopbarView extends Container {
    private _bg!: NineSlicePlane;
    private _progressbar!: ProgressbarView;
    private _moves!: MovesView;
    private _score!: ScoreView;

    public constructor() {
        super();
        this._buildBg();
        this._buildProgressbar();
        this._buildMoves();
        this._buildScore();
        this.resize();

        mono.model.on('Game:ScoreUpdated', this._onScoreUpdated, this);
        mono.model.on('Game:MovesUpdated', this._onMovesUpdated, this);
    }

    public resize(): void {
        lp(this._resizeLandscape, this._resizePortrait).call(this);
    }

    private _resizeLandscape(): void {
        this._resizeBgLandscape();
        this._resizeProgressbarLandscape();
        this._resizeMovesLandscape();
        this._resizeScoreLandscape();
    }

    private _resizePortrait(): void {
        this._resizeBgPortrait();
        this._resizeProgressbarPortrait();
        this._resizeMovesPortrait();
        this._resizeScorePortrait();
    }

    private _buildBg(): void {
        const bg = new NineSlicePlane(Texture.from(textures['ui/bg-blue']), 47, 41, 47, 54);
        this.addChild((this._bg = bg));
    }

    private _buildProgressbar(): void {
        const progressbar = new ProgressbarView();
        this.addChild((this._progressbar = progressbar));
    }

    private _buildMoves(): void {
        const moves = new MovesView();
        this.addChild((this._moves = moves));
    }

    private _buildScore(): void {
        const score = new ScoreView();
        this.addChild((this._score = score));
    }

    private _resizeBgLandscape(): void {
        this._bg.width = 1400;
        this._bg.height = 260;
    }

    private _resizeProgressbarLandscape(): void {
        this._progressbar.resize();
        this._progressbar.x = (this._bg.width - this._progressbar.width) / 2;
    }

    private _resizeMovesLandscape(): void {
        this._moves.x = ((this._bg.width - this._progressbar.width) / 2 - this._moves.width) / 2 + 20;
        this._moves.y = this._bg.height - this._moves.height - 80;
    }

    private _resizeScoreLandscape(): void {
        this._score.x =
            this._progressbar.x +
            this._progressbar.width +
            ((this._bg.width - this._progressbar.width) / 2 - this._moves.width) / 2 -
            20;
        this._score.y = this._bg.height - this._score.height - 80;
    }

    private _resizeBgPortrait(): void {
        this._bg.width = 740;
        this._bg.height = 500;
    }

    private _resizeProgressbarPortrait(): void {
        this._progressbar.resize();
        this._progressbar.x = (this._bg.width - this._progressbar.width) / 2;
    }

    private _resizeMovesPortrait(): void {
        this._moves.x = this._bg.width / 2 - this._bg.width / 4 - this._moves.width / 2;
        this._moves.y = this._bg.height - this._moves.height - 65;
    }

    private _resizeScorePortrait(): void {
        this._score.x = this._bg.width / 2 + this._bg.width / 4 - this._score.width / 2;
        this._score.y = this._bg.height - this._score.height - 65;
    }

    private _onScoreUpdated(score: number, targetScore: number): void {
        this._score.setValue(score);
        this._progressbar.setProgress(score / targetScore);
    }

    private _onMovesUpdated(moves: number): void {
        this._moves.setValue(moves);
    }
}
