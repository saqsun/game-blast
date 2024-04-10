import { getGameDiv, getResolution } from '../../../utils';

export class ScreenSizeManager {
    private static readonly _resolution = getResolution();
    private static readonly _designDimension: Record<Orientation, Dimension> = {
        landscape: { width: 1920, height: 1080 },
        portrait: { width: 1080, height: 1920 },
    };

    public orientation: Orientation;
    public bounds: Dimension;
    public scale: number;

    private readonly _gameDiv: HTMLDivElement;

    public constructor(private readonly _app: IApp) {
        this._gameDiv = getGameDiv();

        this.orientation = 'landscape';
        this.bounds = { ...ScreenSizeManager._designDimension[this.orientation] };
        this.scale = 1;

        this._app.emitter.once('start', this.onAppStart, this);
        this._app.emitter.on('resume', this.onAppResume, this);

        window.addEventListener('resize', () => this.resize());
    }

    public readonly onAppStart = (): void => {
        this.resize();
    };

    public readonly onAppResume = (): void => {
        this.resize();
    };

    public readonly resize = (): void => {
        const windowWidth = this._gameDiv.clientWidth;
        const windowHeight = this._gameDiv.clientHeight;

        this.orientation = windowWidth > windowHeight ? 'landscape' : 'portrait';

        const { width: designWidth, height: designHeight } = ScreenSizeManager._designDimension[this.orientation];

        this.scale = Math.min(windowWidth / designWidth, windowHeight / designHeight);

        const scaleRatio = this.scale * ScreenSizeManager._resolution;

        this.bounds.width = windowWidth / scaleRatio;
        this.bounds.height = windowHeight / scaleRatio;

        this._app.emitter.emit('resize', this.orientation, this.bounds, this.scale);
    };
}
