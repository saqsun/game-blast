import { gsap } from 'gsap';
import { Linear, PixiPlugin } from 'gsap/all';
import { DisplayObject, Graphics } from 'pixi.js';

export class TweenPlugin implements IAppPlugin {
    public constructor(private readonly _app: IApp) {
        this._app.emitter.on('pluginInstall', this._onAppPluginInstall, this);
        this._app.emitter.on('pause', this._onAppPause, this);
        this._app.emitter.on('resume', this._onAppResume, this);
        this._app.emitter.on('start', this._onAppStart, this);
    }

    public async onInstall(): Promise<void> {
        gsap.ticker.remove(gsap.updateRoot);

        gsap.defaults({
            ease: Linear.easeNone,
        });
    }

    public async onUninstall(): Promise<void> {
        //
    }

    private _onAppStart(): void {
        this._app.ticker.add(this._onAppUpdate);
    }

    private _onAppPluginInstall<T extends AppPluginName>(name: T, plugin: IAppPlugin): void {
        switch (name) {
            case 'pixi': {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                PixiPlugin.registerPIXI({ DisplayObject, Graphics });
                gsap.registerPlugin(PixiPlugin);
                break;
            }
        }
    }

    private _onAppPause(): void {
        gsap.ticker.sleep();
    }

    private _onAppResume(): void {
        gsap.ticker.wake();
    }

    private readonly _onAppUpdate = (time: number, dt: number): void => {
        gsap.updateRoot(time * 0.001);
    };
}
