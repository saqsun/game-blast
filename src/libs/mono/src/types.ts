export type CommandType<StoreType, EE extends Events, E extends EventType<EE>> = (
    store: StoreType,
    ...params: ParamsType<EE, E>
) => void | Promise<void>;

export type GuardType = (...args: any[]) => boolean;

export interface IEventSubscriber<E extends string> {
    onEvent: (evt: E, args: any[]) => void;
}

export interface IEventListener<P extends Parameters<(...args: any[]) => any>> {
    listener: (...params: P) => void | Promise<void>;
    context?: any;
    once?: boolean;
}

export type Events = Record<string, EventEntry>;

export type EventType<T extends Events> = {
    [K in keyof T]: EventEntryType<T[K]>;
}[keyof T];

export type ParamsType<T extends Events, P extends EventType<T>> = {
    [K in keyof T]: ParamsEntryType<T[K], P>;
}[keyof T];

type EventEntry = Record<string, { event: string; params: Parameters<(...args: any[]) => void> }>;

type EventEntryType<T extends EventEntry> = {
    [K in keyof T]: T[K]['event'];
}[keyof T];

type ParamsEntryType<T extends EventEntry, P extends string> = {
    [K in keyof T]: T[K]['event'] extends P ? T[K]['params'] : never;
}[keyof T];
