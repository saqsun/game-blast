import type { Mono } from './mono';

export class MonoLogger {
    private _logFunction!: typeof console.group;

    private readonly _commandExecute: (fn: (...args: any[]) => void | Promise<void>) => Promise<void>;
    private readonly _modelEmit: (evt: string, ...args: any[]) => void;
    private readonly _viewEmit: (evt: string, ...args: any[]) => void;

    public constructor(private readonly _mono: Mono<any, any>) {
        this._commandExecute = this._mono.command.execute;
        this._modelEmit = this._mono.model.emit;
        this._viewEmit = this._mono.view.emit;

        this._mono.command.execute = this._boundCommandExecute.bind(this);
        this._mono.model.emit = this._boundModelEmit.bind(this);
        this._mono.view.emit = this._boundViewEmit.bind(this);

        this.expanded(true);
    }

    public expanded(enable: boolean): void {
        this._logFunction = enable ? console.group : console.groupCollapsed;
    }

    private async _boundCommandExecute(fn: (...args: any[]) => void | Promise<void>): Promise<void> {
        // @ts-expect-error accessing private property "_payloads"
        const payloads = [...this._mono.command._payloads];

        // @ts-expect-error accessing private property "_guards"
        const guards = [...this._mono.command._guards];

        for (const guard of guards) {
            if (!guard.call(this._mono.command, this._mono.store, ...payloads)) {
                void this._commandExecute.call(this._mono.command, fn);

                return;
            }
        }

        this._logFunction(
            `%c c %c | %c${fn.name}`,
            'color: #ffc857; font-size:13px; font-weight: 900; background-color: #084c61',
            'color: #ffffff; font-size:12px; font-weight: 500',
            'color: #80ffdb; font-size:12px',
            payloads,
        );
        void this._commandExecute.call(this._mono.command, fn);
        console.groupEnd();
    }

    private _boundModelEmit(evt: string, ...args: any[]): void {
        this._logFunction(
            `%c m %c | %c${evt}`,
            'color: #ffc857; font-size:13px; font-weight: 900; background-color: #084c61',
            'color: #ffffff; font-size:12px; font-weight: 500',
            'color: #80ffdb; font-size:12px',
            args,
        );

        this._modelEmit.call(this._mono.model, evt, ...args);
        console.groupEnd();
    }

    private _boundViewEmit(evt: string, ...args: any[]): void {
        this._logFunction(
            `%c v %c | %c${evt}`,
            'color: #ffc857; font-size:13px; font-weight: 900; background-color: #084c61',
            'color: #ffffff; font-size:12px; font-weight: 500',
            'color: #80ffdb; font-size:12px',
            args,
        );

        this._viewEmit.call(this._mono.view, evt, ...args);
        console.groupEnd();
    }
}
