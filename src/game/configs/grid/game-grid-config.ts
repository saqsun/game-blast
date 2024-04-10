import { CellScale, type IGridConfig } from '../../../libs/grid';

const getLandscapeConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0x0000ff },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'blast',
                bounds: { x: 0.1, y: 0.24, width: 0.8, height: 1 - 0.24 },
                offset: { x: 0, y: -26 },
                scale: CellScale.showAll,
            },
        ],
    };
};

const getPortraitConfig = (bounds: Dimension, scale: number): IGridConfig => {
    const { width, height } = bounds;

    return {
        // debug: { color: 0x0000ff },
        area: { x: 0, y: 0, width, height },
        cells: [
            {
                name: 'blast',
                bounds: { x: 0.025, y: 0.3, width: 1 - 2 * 0.025, height: 0.7 },
                offset: { x: 0, y: -50 },
                scale: CellScale.showAll,
            },
        ],
    };
};

const configs: Record<Orientation, (bounds: Dimension, scale: number) => IGridConfig> = {
    landscape: getLandscapeConfig,
    portrait: getPortraitConfig,
};

export const getGameGridConfig = (): IGridConfig => {
    const { app } = gameblast;
    const { screen } = app;
    const { orientation, bounds, scale } = screen;

    return configs[orientation](bounds, scale);
};
