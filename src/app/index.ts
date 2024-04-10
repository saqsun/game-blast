import { EventEmitter } from 'eventemitter3';
import assets from '../assets';
import { LoaderPlugin } from './plugins/loader/loader-plugin';
import { PixiPlugin } from './plugins/pixi/pixi-plugin';
import { ScreenPlugin } from './plugins/screen/screen-plugin';
import { SoundPlugin } from './plugins/sound/sound-plugin';
import { TickerPlugin } from './plugins/ticker/ticker-plugin';
import { TweenPlugin } from './plugins/tween/tween-plugin';

class App implements IApp {
    public readonly emitter: EventEmitter<AppEventMap>;
    public readonly plugins: Partial<Record<AppPluginName, IAppPlugin>>;

    private readonly _assets = assets;

    public constructor() {
        this.plugins = {};
        this.emitter = new EventEmitter();
    }

    public get screen(): ScreenPlugin {
        return this.getPlugin('screen')!;
    }

    public get ticker(): TickerPlugin {
        return this.getPlugin('ticker')!;
    }

    public get pixi(): PixiPlugin {
        return this.getPlugin('pixi')!;
    }

    public get loader(): LoaderPlugin {
        return this.getPlugin('loader')!;
    }

    public async load(): Promise<void> {
        await this.loader.load(this._assets);
    }

    public async start(): Promise<void> {
        return await new Promise((resolve) => {
            this.emitter.emit('start');
            this.ticker.post().emitter.on('complete', () => resolve());
        });
    }

    public getPlugin<T extends IAppPlugin>(name: AppPluginName): T | undefined {
        return this.plugins[name] as T | undefined;
    }

    public async installPlugin(name: AppPluginName, plugin: IAppPlugin): Promise<void> {
        await plugin.onInstall();

        this.plugins[name] = plugin;

        this.emitter.emit('pluginInstall', name, plugin);
    }

    public async uninstallPlugin(name: AppPluginName): Promise<void> {
        const plugin = this.getPlugin(name);

        if (plugin == null) {
            return;
        }

        await plugin.onUninstall();

        delete this.plugins[name];

        this.emitter.emit('pluginUninstall', name, plugin);
    }
}

const app = new App();
gameblast.app = app;

await app.installPlugin('screen', new ScreenPlugin(app));
await app.installPlugin('ticker', new TickerPlugin(app));
await app.installPlugin('tween', new TweenPlugin(app));
await app.installPlugin('loader', new LoaderPlugin(app));
await app.installPlugin('pixi', new PixiPlugin(app));
await app.installPlugin('sound', new SoundPlugin(app));
