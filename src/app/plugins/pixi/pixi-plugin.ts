import { Ticker as PixiTicker } from 'pixi.js';
import { PixiRenderer } from './pixi-renderer';
import { PixiStage } from './pixi-stage';

export class PixiPlugin implements IAppPlugin {
    public readonly renderer: PixiRenderer;
    public readonly stage: PixiStage;
    public readonly ticker!: PixiTicker;

    public constructor(private readonly _app: IApp) {
        this.renderer = new PixiRenderer();
        this.stage = new PixiStage();

        if (process.env.NODE_ENV === 'development') {
            // @ts-expect-error - globalThis
            globalThis.__PIXI_STAGE__ = this.stage;
            // @ts-expect-error - globalThis
            globalThis.__PIXI_RENDERER__ = this.renderer;

            const statsScript = document.createElement('script');
            statsScript.innerText =
                // eslint-disable-next-line quotes
                "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()";

            document.body.appendChild(statsScript);
        }

        this.ticker = PixiTicker.shared;
        this.ticker.autoStart = false;
        this.ticker.stop();
    }

    public async onInstall(): Promise<void> {
        this._app.emitter.once('start', this._onAppStart, this);
        this._app.emitter.on('resize', this._onAppResize, this);
    }

    public async onUninstall(): Promise<void> {
        this._app.emitter.off('start', this._onAppStart, this);
        this._app.ticker.remove(this._onAppUpdate);
    }

    private _onAppStart(): void {
        this._app.ticker.add(this._onAppUpdate);
    }

    private _onAppResize(orientation: Orientation, bounds: Dimension, scale: number): void {
        this.renderer.resize(bounds.width, bounds.height);
    }

    private readonly _onAppUpdate = (time: number, dt: number): void => {
        this.ticker.update(time);
        this.renderer.render(this.stage);
    };
}
