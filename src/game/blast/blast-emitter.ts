import { EventEmitter } from 'eventemitter3';

/* eslint-disable @typescript-eslint/naming-convention */
type IEmitterEvents = {
    'Core:Ready': [];
    'Action:Move': [action: IMoveAction];
    'Action:TapAccept': [action: IMoveAction, matches: IMatchResult[]];
    'Action:TapReject': [action: IMoveAction];
    'Process:Start': [matches: IMatchResult[]];
    'Process:Complete': [matches: IMatchResult[]];
    'Process:RoundStart': [];
    'Process:RoundComplete': [matches: IMatchResult[]];
    'Hint:NoMovesFound': [];
};

export class BlastEmitter extends EventEmitter<IEmitterEvents> {
    public constructor() {
        super();
    }
}

export class BlastEmitterLogger {
    private readonly _ignoredEvents: Array<keyof IEmitterEvents> = [];
    private readonly _originalEmit: EventEmitter<IEmitterEvents>['emit'];

    public constructor(private readonly _emitter: EventEmitter<IEmitterEvents>) {
        this._originalEmit = this._emitter.emit;
        this._emitter.emit = this.emit.bind(this);
    }

    public emit<T extends keyof IEmitterEvents>(
        event: T,
        ...args: EventEmitter.ArgumentMap<IEmitterEvents>[Extract<T, keyof IEmitterEvents>]
    ): boolean {
        if (!this._ignoredEvents.includes(event)) {
            console.log(`%cBlast | ${event} `, 'color: #ffa603; font-size:11px;', args);
        }

        // @ts-expect-error typing error
        return this._originalEmit.call(this._emitter, event, ...args);
    }
}
