import type { Events, EventType, IEventListener, ParamsType } from './types';

export class MonoEmitter<EE extends Events> {
    protected listeners: Partial<Record<EventType<EE>, Array<IEventListener<any>>>> = {};

    public on<E extends EventType<EE>>(
        evt: E,
        listener: IEventListener<ParamsType<EE, E>>['listener'],
        context?: any,
    ): this {
        return this.addListener(evt, listener, context, false);
    }

    public once<E extends EventType<EE>>(
        evt: E,
        listener: IEventListener<ParamsType<EE, E>>['listener'],
        context?: any,
    ): this {
        return this.addListener(evt, listener, context, true);
    }

    public off<E extends EventType<EE>>(
        evt: E,
        listener: IEventListener<ParamsType<EE, E>>['listener'],
        context?: any,
    ): this {
        return this.removeListener(evt, listener, context);
    }

    public emit<E extends EventType<EE>>(evt: E, ...args: ParamsType<EE, E>): void {
        const ll = this.listeners[evt] ?? [];

        for (let i = 0; i < ll.length; i++) {
            const { listener, context, once } = ll[i];

            void listener.call(context, ...args);

            if (once) {
                this.removeListener(evt, listener, context);
            }
        }
    }

    public dispose(): void {
        this.listeners = {};
    }

    public removeListenersOf(context: any): void {
        (Object.keys(this.listeners) as Array<EventType<EE>>).forEach((evt) => {
            const ll = this.listeners[evt];
            ll?.forEach((l) => {
                if (l.context === context) {
                    this.removeListener(evt, l.listener, context);
                }
            });
        });
    }

    protected addListener<E extends EventType<EE>>(
        evt: E,
        listener: IEventListener<ParamsType<EE, E>>['listener'],
        context: any,
        once: boolean,
    ): this {
        const ll = this.listeners[evt] ?? [];

        ll.push({ context, listener, once });

        this.listeners[evt] = ll;

        return this;
    }

    protected removeListener<E extends EventType<EE>>(
        evt: E,
        listener: IEventListener<ParamsType<EE, E>>['listener'],
        context: any,
    ): this {
        const ll = [...(this.listeners[evt] ?? [])];

        const l = ll.find((l) => l.context === context && l.listener === listener);

        if (l != null) {
            ll.splice(ll.indexOf(l), 1);
            this.listeners[evt] = ll;
        }

        return this;
    }
}
