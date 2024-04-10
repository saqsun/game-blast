import type { GameModel, GameState } from '../game/state/models/game-model';
import type { UIModel } from '../game/state/models/ui-model';
import type { StoreModel } from './store';

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace MonoType {
    type IStore = StoreModel;

    interface IEvents {
        /* VIEW */
        view: {
            //
            blast: {
                coreReady: {
                    event: 'Blast:CoreReady';
                    params: [blast: IBlast];
                };
                processComplete: {
                    event: 'Blast:ProcessComplete';
                    params: [matches: IMatchResult[]];
                };
            };
        };

        /* MODEL */
        model: {
            ui: {
                initialized: {
                    event: 'UI:Initialized';
                    params: [model: UIModel];
                };
            };
            game: {
                initialized: {
                    event: 'Game:Initialized';
                    params: [model: GameModel];
                };
                scoreUpdated: {
                    event: 'Game:ScoreUpdated';
                    params: [score: number, targetScore: number];
                };
                movesUpdated: {
                    event: 'Game:MovesUpdated';
                    params: [moves: number];
                };
                stateUpdated: {
                    event: 'Game:StateUpdated';
                    params: [state: GameState];
                };
            };
        };
    }
}
