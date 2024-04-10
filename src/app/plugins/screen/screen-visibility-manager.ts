import { getDocumentPrefix, lowercaseFirst } from '../../../utils';

export class ScreenVisibilityManager {
    private static readonly _keys = { hidden: '', event: '' };

    public constructor(private readonly _app: IApp) {
        const prefix = getDocumentPrefix(document);

        ScreenVisibilityManager._keys.event = `${prefix}visibilitychange`;
        ScreenVisibilityManager._keys.hidden = lowercaseFirst(`${prefix}Hidden`);

        document.addEventListener(ScreenVisibilityManager._keys.event, this._onVisibilityChange, { once: false });
    }

    public get visible(): boolean {
        return document[ScreenVisibilityManager._keys.hidden as keyof typeof document] === false;
    }

    private readonly _onVisibilityChange = (): void => {
        this._app.emitter.emit(this.visible ? 'resume' : 'pause');
    };
}
