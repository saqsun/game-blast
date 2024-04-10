/* eslint-disable @typescript-eslint/naming-convention */
export declare global {
    interface Document {
        mozHidden?: string;
        msHidden?: string;
        webkitHidden?: string;
    }

    interface Window {
        Howler: HowlerGlobal & { _howls: Array<Howl & { _id: string }> };
        gameblast: {
            splash: ISplash;
            app: IApp;
        };
    }

    declare const gameblast = window.gameblast;
}
