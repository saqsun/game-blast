import type { IGridConfig } from '../../../libs/grid';
import { Grid } from '../../../libs/grid';
import { mono } from '../../../mono';
import { Blast } from '../../blast/blast';
import { getGameGridConfig } from '../../configs/grid/game-grid-config';
import { GameState } from '../../state/models/game-model';
import { LosePopup } from '../ui/popup/lose-popup';
import { WinPopup } from '../ui/popup/win-popup';

export class GameView extends Grid {
    private _blast!: Blast;
    private _winPopup!: WinPopup;
    private _losePopup!: LosePopup;

    public constructor() {
        super();
        this.name = 'GameView';

        const { app } = gameblast;
        const { pixi } = app;
        const { stage } = pixi;
        this.parentLayer = stage.gameLayer;

        this._buildBlast();
        this._buildWinPopup();
        this._buildLosePopup();

        mono.model.on('Game:StateUpdated', this._onGameStateUpdated, this);
    }

    public getGridConfig(): IGridConfig {
        return getGameGridConfig();
    }

    public rebuild(): void {
        super.rebuild();
        this._winPopup?.rebuild();
        this._losePopup?.rebuild();
    }

    private _buildBlast(): void {
        this._blast = new Blast(true, true);
        this.attach('blast', this._blast);
    }

    private _buildWinPopup(): void {
        this._winPopup = new WinPopup();
    }

    private _buildLosePopup(): void {
        this._losePopup = new LosePopup();
    }

    private _onGameStateUpdated(state: GameState): void {
        console.warn('GameModel._setState', state);
        switch (state) {
            case GameState.playing:
                this._blast.board.setLock(false);
                break;
            case GameState.win:
                this._blast.board.setLock(true);
                this._winPopup.show();
                this.addChild(this._winPopup);
                break;
            case GameState.lose:
                this._blast.board.setLock(true);
                this._losePopup.show();
                this.addChild(this._losePopup);
                break;
        }
    }
}
