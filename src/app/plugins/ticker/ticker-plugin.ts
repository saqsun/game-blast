import type { ITickerTaskConfig, TickerCallback, TickerTask } from './ticker';
import { Ticker } from './ticker';

export class TickerPlugin implements IAppPlugin {
    private readonly _ticker: Ticker;

    public constructor(private readonly _app: IApp) {
        this._ticker = new Ticker();

        this._app.emitter.on('pause', this._onAppPause, this);
        this._app.emitter.on('resume', this._onAppResume, this);
        this._app.emitter.on('start', this._onAppStart, this);
    }

    public add(fn: TickerCallback): void {
        return this._ticker.add(fn);
    }

    public remove(fn: TickerCallback): void {
        return this._ticker.remove(fn);
    }

    public addTask(config: ITickerTaskConfig): TickerTask {
        return this._ticker.addTask(config);
    }

    public removeTask(task: TickerTask): void {
        return this._ticker.removeTask(task);
    }

    public post(): TickerTask {
        return this.addTask({ delay: 0 });
    }

    public async wait(duration: number): Promise<void> {
        return await new Promise((resolve) => {
            this.addTask({ delay: duration }).emitter.once('complete', () => resolve());
        });
    }

    public async onInstall(): Promise<void> {
        //
    }

    public async onUninstall(): Promise<void> {
        this._ticker.stop();
    }

    private _onAppStart(): void {
        this._ticker.start();
    }

    private _onAppPause(): void {
        console.log('pause');
        this._ticker.stop();
    }

    private _onAppResume(): void {
        console.log('resume');
        this._ticker.start();
    }
}
