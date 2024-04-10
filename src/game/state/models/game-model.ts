import { mono } from '../../../mono';

export enum GameState {
    unknown,
    playing,
    win,
    lose,
}

export class GameModel {
    private _state = GameState.unknown;

    private _moves = 0;
    private _targetScore = 0;
    private _score = 0;

    public constructor() {
        //
    }

    public get state(): GameState {
        return this._state;
    }

    public get moves(): number {
        return this._moves;
    }

    public set moves(value: number) {
        this._moves = Math.max(0, value);
        mono.model.emit('Game:MovesUpdated', this._moves);
        if (this._moves === 0) {
            this._setState(GameState.lose);
        }
    }

    public get targetScore(): number {
        return this._targetScore;
    }

    public get score(): number {
        return this._score;
    }

    public set score(value: number) {
        this._score = Math.min(this._targetScore, value);
        mono.model.emit('Game:ScoreUpdated', this._score, this._targetScore);
        if (this._score === this._targetScore) {
            this._setState(GameState.win);
        }
    }

    public initialize(config: { moves: number; score: number }): void {
        const { moves, score } = config;
        this._moves = moves;
        this._targetScore = score;
        //
        mono.model.emit('Game:Initialized', this);

        this._setState(GameState.playing);
    }

    private _setState(value: GameState): void {
        if (this._state === GameState.lose || this._state === GameState.win) {
            return;
        }
        this._state = value;
        mono.model.emit('Game:StateUpdated', this._state);
    }
}
