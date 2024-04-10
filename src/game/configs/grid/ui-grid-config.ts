import { CellAlign, type IGridConfig } from '../../../libs/grid';
import { getResolution } from '../../../utils';

const getLandscapeConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0xff0000 },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'topbar-bg',
                bounds: { x: 0.14, y: -0.035, width: 1 - 2 * 0.14, height: 0.21 },
                align: CellAlign.centerTop,
            },
        ],
    };
};

const getPortraitConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0xff0000 },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'topbar-bg',
                offset: { x: 0, y: 38 / getResolution() },
                bounds: { x: 0.08, y: -0.1, width: 1 - 2 * 0.08, height: 0.3 },
                align: CellAlign.centerTop,
            },
        ],
    };
};

const configs: Record<Orientation, (bounds: Dimension, scale: number) => IGridConfig> = {
    landscape: getLandscapeConfig,
    portrait: getPortraitConfig,
};

export const getUiGridConfig = (): IGridConfig => {
    const { app } = gameblast;
    const { screen } = app;
    const { orientation, bounds, scale } = screen;

    return configs[orientation](bounds, scale);
};
