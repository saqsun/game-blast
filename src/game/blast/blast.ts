import { Container } from 'pixi.js';
import { mono } from '../../mono';
import { BlastActions } from './blast-actions';
import { BlastBoard } from './blast-board';
import { BlastConfig } from './blast-config';
import { BlastDebug } from './blast-debug';
import { BlastEffects } from './blast-effects';
import { BlastEmitter } from './blast-emitter';
import { BlastHint } from './blast-hint';
import { BlastMatcher } from './blast-matcher';
import { BlastProcess } from './blast-process';
import { BlastItemFactory } from './items/blast-item-factory';

export class Blast extends Container implements IBlast {
    public readonly debug?: BlastDebug;
    public readonly board: BlastBoard;
    public readonly hint?: BlastHint;
    public readonly config: BlastConfig;
    public readonly actions: BlastActions;
    public readonly process: BlastProcess;
    public readonly matcher: BlastMatcher;
    public readonly effects: BlastEffects;
    public readonly emitter: BlastEmitter;

    public constructor(debug = false, hint = false) {
        super();

        this.emitter = new BlastEmitter();
        this.config = new BlastConfig();
        this.board = new BlastBoard(this);
        this.hint = new BlastHint(this, hint);
        this.actions = new BlastActions(this);
        this.process = new BlastProcess(this);
        this.matcher = new BlastMatcher(this);
        this.effects = new BlastEffects(this);

        if (debug) {
            this.debug = new BlastDebug(this, 1);
        }

        this.emitter.emit('Core:Ready');

        this.emitter.on('Process:Complete', this._onProcessComplete, this);

        mono.view.emit('Blast:CoreReady', this);
    }

    public destroy(): void {
        this.emitter.removeAllListeners();
        BlastItemFactory.dispose();
        super.destroy({ children: true });
    }

    private _onProcessComplete(matches: IMatchResult[]): void {
        mono.view.emit('Blast:ProcessComplete', matches);
    }
}
