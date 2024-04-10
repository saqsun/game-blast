import type { GameModel } from '../game/state/models/game-model';
import type { UIModel } from '../game/state/models/ui-model';

export class StoreModel {
    private _game!: GameModel;
    private _ui!: UIModel;

    public constructor() {
        //
    }

    public get game(): GameModel {
        return this._game;
    }

    public setGame(model: GameModel): void {
        this._game = model;
        this._game.initialize({ moves: 20, score: 275 });
    }
    public setUI(model: UIModel): void {
        this._ui = model;
        this._ui.initialize();
    }
}
