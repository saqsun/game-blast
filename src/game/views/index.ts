import { Container } from 'pixi.js';
import { mono } from '../../mono';
import { GameView } from './game/game-view';
import { UIView } from './ui/ui-view';

export class MainView extends Container {
    private _ui: UIView | undefined;
    private _game: GameView | undefined;

    public constructor() {
        super();

        mono.model.on('Game:Initialized', this._onGameInitialized, this);
        mono.model.on('UI:Initialized', this._onUIInitialized, this);

        const { app } = gameblast;
        app.emitter.on('resize', this._onAppResize, this);
    }

    private _onGameInitialized(): void {
        this.addChild((this._game = new GameView()));
    }

    private _onUIInitialized(): void {
        this.addChild((this._ui = new UIView()));
    }

    private _onAppResize(orientation: Orientation, bounds: Dimension, scale: number): void {
        this._ui?.rebuild();
        this._game?.rebuild();
    }
}
