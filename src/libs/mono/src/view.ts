import { MonoEmitter } from './emitter';
import type { Events, EventType, IEventSubscriber, ParamsType } from './types';

export class MonoView<EE extends Events> extends MonoEmitter<EE> {
    public constructor(private readonly _command: IEventSubscriber<any>) {
        super();
    }

    public emit<E extends EventType<EE>>(evt: E, ...params: ParamsType<EE, E>): void {
        super.emit(evt, ...params);

        this._command.onEvent(evt, params);
    }
}
