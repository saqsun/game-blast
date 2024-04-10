import type { IGridConfig } from '../../../libs/grid';
import { Grid } from '../../../libs/grid';
import { getUiGridConfig } from '../../configs/grid/ui-grid-config';
import { TopbarView } from './topbar/topbar-view';

export class UIView extends Grid {
    private _topbar!: TopbarView;

    public constructor() {
        super();
        this.name = 'UIView';

        const { app } = gameblast;
        const { pixi } = app;
        const { stage } = pixi;
        this.parentLayer = stage.uiLayer;

        this._buildTopbar();
    }

    public getGridConfig(): IGridConfig {
        return getUiGridConfig();
    }

    public rebuild(): void {
        this._topbar?.resize();
        super.rebuild();
    }

    private _buildTopbar(): void {
        this._topbar = new TopbarView();
        this.attach('topbar-bg', this._topbar);
    }
}
