import { AtlasLoader } from './subloader/atlas-loader';
import { FontLoader } from './subloader/font-loader';
import { ImageLoader } from './subloader/image-loader';
import { JsonLoader } from './subloader/json-loader';
import { ParticlesLoader } from './subloader/particles-loader';
import { SoundLoader } from './subloader/sound-loader';
import type { ISubloader } from './subloader/subloader';

export class LoaderPlugin implements IAppPlugin {
    private readonly _cache: Record<AppAssetsKey, Record<string, unknown>> = Object.create(null) as Record<
        AppAssetsKey,
        Record<string, unknown>
    >;
    private readonly _subloaders: Record<AppAssetsKey, ISubloader> = Object.create(null) as Record<
        AppAssetsKey,
        ISubloader
    >;

    public constructor(private readonly _app: IApp) {}

    public get cache(): Record<AppAssetsKey, Record<string, unknown>> {
        return this._cache;
    }

    public async onInstall(): Promise<void> {
        //
    }

    public async onUninstall(): Promise<void> {
        //
    }

    public async load(assets: AppAssets): Promise<void> {
        this._onLoadStart();

        this._subloaders['atlases'] = new AtlasLoader();
        this._subloaders['fonts'] = new FontLoader(assets.bitmapFonts);
        this._subloaders['images'] = new ImageLoader();
        this._subloaders['jsons'] = new JsonLoader();
        this._subloaders['particles'] = new ParticlesLoader();
        this._subloaders['sounds'] = new SoundLoader();

        const all = Object.keys(this._subloaders).reduce((acc, key) => {
            acc.push(...this._subload(assets, key as AppAssetsKey));
            return acc;
        }, [] as Promise<unknown>[]);

        await Promise.all(all);

        this._onLoadComplete();

        console.log('Assets loaded', this._cache);
    }

    private readonly _onLoadStart = (): void => {
        this._app.emitter.emit('loadStart');
    };

    private readonly _onLoadComplete = (): void => {
        this._app.emitter.emit('loadComplete');
    };

    private _subload(assets: AppAssets, key: AppAssetsKey): Promise<unknown>[] {
        const subcache = Object.create(null);
        this._cache[key] = subcache;
        const resources = assets[key];
        const loader = this._subloaders[key];
        return Object.keys(resources).map((r) => loader.load(subcache, r, resources[r as keyof typeof resources]));
    }
}
