import { ScreenSizeManager } from './screen-size-manager';
import { ScreenVisibilityManager } from './screen-visibility-manager';

export class ScreenPlugin implements IAppPlugin {
    private readonly _visibilityManager: ScreenVisibilityManager;
    private readonly _screenSizeManager: ScreenSizeManager;

    public constructor(private readonly _app: IApp) {
        this._visibilityManager = new ScreenVisibilityManager(this._app);
        this._screenSizeManager = new ScreenSizeManager(this._app);
    }

    public get isVisible(): boolean {
        return this._visibilityManager.visible;
    }

    public get orientation(): Orientation {
        return this._screenSizeManager.orientation;
    }

    public get bounds(): Dimension {
        return this._screenSizeManager.bounds;
    }

    public get scale(): number {
        return this._screenSizeManager.scale;
    }

    public async onInstall(): Promise<void> {
        //
    }

    public async onUninstall(): Promise<void> {
        //
    }
}
