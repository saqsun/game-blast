import type { CommandType, Events, EventType, GuardType, IEventSubscriber, ParamsType } from './types';

export class MonoCommand<StoreType, EE extends Events> implements IEventSubscriber<any> {
    private readonly _commands = new Map<EventType<EE>, Array<CommandType<StoreType, EE, any>>>();

    private _payloads: any[] = [];
    private readonly _guards: GuardType[] = [];

    public constructor(private readonly _store: StoreType) {
        //
    }

    public map<E extends EventType<EE>>(evt: E, command: CommandType<StoreType, EE, E>): void {
        const set = this._commands.get(evt) || [];
        set.push(command);

        this._commands.set(evt, set);
    }

    public unmap<E extends EventType<EE>>(evt: E, command?: CommandType<StoreType, EE, E>): void {
        if (command == null) {
            this._commands.delete(evt);

            return;
        }

        const set = [...(this._commands.get(evt) ?? [])];
        if (set.length === 0 || set.indexOf(command) < 0) {
            return;
        }

        set.splice(set.indexOf(command), 1);
        this._commands.set(evt, set);
    }

    public onEvent<E extends EventType<EE>>(evt: E, params: ParamsType<EE, E>): void {
        const set = this._commands.get(evt);
        if (set == null) {
            return;
        }

        this.payload(...params);
        set.forEach((command) => void this.execute(command));
    }

    public payload(...args: any[]): this {
        this._payloads = args;

        return this;
    }

    public guard(guard: GuardType): this {
        this._guards.push(guard);

        return this;
    }

    public async execute(command: CommandType<StoreType, any, any>): Promise<void> {
        const payloads = [...this._payloads];
        const guards = [...this._guards];

        this._payloads.length = 0;
        this._guards.length = 0;

        for (const guard of guards) {
            if (!guard(this._store, ...payloads)) {
                return;
            }
        }

        await command(this._store, ...payloads);
    }
}
