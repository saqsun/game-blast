import type { EventEmitter } from 'eventemitter3';
import type { LoaderPlugin } from '../src/app/plugins/loader/loader-plugin';
import type { PixiPlugin } from '../src/app/plugins/pixi/pixi-plugin';
import type { ScreenPlugin } from '../src/app/plugins/screen/screen-plugin';
import type { TickerPlugin } from '../src/app/plugins/ticker/ticker-plugin';

export declare global {
    interface IApp {
        readonly emitter: EventEmitter<AppEventMap>;
        readonly plugins: Partial<Record<AppPluginName, IAppPlugin>>;

        screen: ScreenPlugin;
        ticker: TickerPlugin;
        pixi: PixiPlugin;
        loader: LoaderPlugin;

        load(): Promise<void>;
        start(): Promise<void>;
        getPlugin(name: AppPluginName): IAppPlugin | undefined;
        installPlugin(name: AppPluginName, plugin: IAppPlugin): Promise<void>;
        uninstallPlugin(name: AppPluginName): Promise<void>;
    }

    type AppEventMap = {
        start: [];
        pause: [];
        resume: [];
        loadStart: [];
        loadComplete: [];
        resize: [orientation: Orientation, bounds: Dimension, scale: number];
        pluginInstall: [name: AppPluginName, plugin: IAppPlugin];
        pluginUninstall: [name: AppPluginName, plugin: IAppPlugin];
    };

    interface IAppPlugin {
        onInstall: () => Promise<void>;
        onUninstall: () => Promise<void>;
    }

    type Orientation = 'landscape' | 'portrait';

    type AppPluginName = 'screen' | 'ticker' | 'pixi' | 'loader' | 'tween' | 'sound';

    type Dimension = {
        width: number;
        height: number;
    };

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    type AppAssets = typeof import('../src/assets').default;
    type AppAssetsKey = keyof AppAssets;

    interface IPoint {
        x: number;
        y: number;
    }

    interface IRect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}
