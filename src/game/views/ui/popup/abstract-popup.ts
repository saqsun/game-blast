import { Grid } from '../../../../libs/grid';
import { PopupBlocker } from './blocker/popup-blocker';

export abstract class AbstractPopup extends Grid {
    protected blocker!: PopupBlocker;

    public constructor() {
        super();

        const { app } = gameblast;
        const { pixi } = app;
        const { stage } = pixi;

        this.parentLayer = stage.popupLayer;
    }

    protected async show(): Promise<void> {
        this._buildBlocker();
        await this.blocker.show();
    }

    private _buildBlocker(): void {
        this.blocker = new PopupBlocker({ alpha: 0.8 });
        this.attach('blocker', this.blocker);
    }
}
