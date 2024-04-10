import type { Container } from 'pixi.js';
import type { CellAlign, CellScale } from './constants';

export type ICellContent = Container & {
    resize?: (width: number, height: number) => void;
    preBuild?: () => void;
    postBuild?: () => void;
};

export interface IGridConfig {
    area: IRect;
    cells: ICellConfig[];
    debug?: ICellDebugConfig;
}

export interface ICellConfig {
    name: string;
    bounds: IRect;
    padding?: IRect;
    offset?: IPoint;
    scale?: CellScale;
    align?: CellAlign;
}

export interface ICellDebugConfig {
    color?: number;
    fill?: number;
}

export interface ICell {
    name: string;
    area: IRect;
    bounds: IRect;
    scale: CellScale;
    align: CellAlign;
    contents: ICellContent[];
    init: (cellConfig: ICellConfig, area: IRect) => ICell;
    addContent: (content: ICellContent) => void;
    removeContent: (content: ICellContent) => void;
}

export interface IGrid {
    area: IRect;
    cells: ICell[];
    getGridConfig: () => IGridConfig;
}

export interface IDimension {
    width: number;
    height: number;
}
