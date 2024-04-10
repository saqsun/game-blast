import type { IGridConfig } from '../../../libs/grid';
import { CellScale } from '../../../libs/grid';

const getLandscapeConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0x00ff00 },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'blocker',
                bounds: { x: 0, y: 0, width: 1, height: 1 },
                scale: CellScale.fill,
            },
            {
                name: 'popup',
                bounds: { x: 0.1, y: 0.15, width: 1 - 2 * 0.1, height: 1 - 2 * 0.15 },
            },
        ],
    };
};

const getPortraitConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0x00ff00 },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'blocker',
                bounds: { x: 0, y: 0, width: 1, height: 1 },
                scale: CellScale.fill,
            },
            {
                name: 'popup',
                bounds: { x: 0.1, y: 0.335, width: 1 - 2 * 0.1, height: 0.43 },
                scale: CellScale.showAll,
            },
        ],
    };
};

const configs = {
    ['landscape']: getLandscapeConfig,
    ['portrait']: getPortraitConfig,
};

export const getLosePopupGridConfig = (): IGridConfig => {
    const { app } = gameblast;
    const { screen } = app;
    const { orientation, bounds, scale } = screen;

    return configs[orientation](bounds, scale);
};
