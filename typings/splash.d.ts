export declare global {
    interface ISplash {
        show(): Promise<void>;
        hide(): Promise<void>;
    }
}
