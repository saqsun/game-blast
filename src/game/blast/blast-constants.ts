/* eslint-disable @typescript-eslint/naming-convention */

import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { getEnumKeys, getEnumValues } from '../../utils';

export const cellDimension: Dimension = { width: 171, height: 171 };

export const getBlastConfig = (): IBlastConfig => {
    return {
        hint: {
            idleTime: 2,
        },

        stats: {
            //
        },

        actions: {
            //
        },

        matcher: {
            matchSize: 2,
        },

        process: {
            chained: true,
        },

        board: {
            grid: [
                [0x13, 0x13, 0x10, 0x12, 0x13, 0x13, 0x13],
                [0x13, 0x13, 0x10, 0x12, 0x13, 0x10, 0x11],
                [0x13, 0x13, 0x31, 0x12, 0x31, 0x10, 0x11],
                [0x13, 0x13, 0x10, 0x11, 0x13, 0x10, 0x13],
                [0x11, 0x13, 0x10, 0x12, 0x10, 0x10, 0x11],
                [0x11, 0x10, 0x11, 0x30, 0x11, 0x10, 0x11],
                [0x14, 0x10, 0x10, 0x11, 0x12, 0x12, 0x12],
                [0x14, 0x10, 0x10, 0x11, 0x12, 0x12, 0x12],
                [0x13, 0x10, 0x10, 0x11, 0x12, 0x12, 0x13],
            ],
        },
    };
};

export enum ZIndex {
    board,
    cell,
    item,
    front,
}

export enum CellType {
    empty = 'empty',
    common = 'common',
}

export enum ItemType {
    unknown = 'unknown',
    simple = 'simple',
    special = 'special',
}

export enum RawItemCode {
    dispose = 0x60,
    random = 0x61,
    empty = 0x62,
}

export enum SimpleItemCode {
    red = 0x10,
    blue = 0x11,
    green = 0x12,
    orange = 0x13,
    purple = 0x14,
}

export enum SpecialItemCode {
    cross = 0x30,
    radial = 0x31,
}

export const ItemTypeMap: Record<ItemCode, ItemType> = {
    [RawItemCode.dispose]: ItemType.unknown,
    [RawItemCode.empty]: ItemType.unknown,
    [RawItemCode.random]: ItemType.unknown,

    [SimpleItemCode.red]: ItemType.simple,
    [SimpleItemCode.blue]: ItemType.simple,
    [SimpleItemCode.green]: ItemType.simple,
    [SimpleItemCode.orange]: ItemType.simple,
    [SimpleItemCode.purple]: ItemType.simple,

    [SpecialItemCode.cross]: ItemType.special,
    [SpecialItemCode.radial]: ItemType.special,
};

export const SimpleItemKeys = getEnumKeys(SimpleItemCode);
export const SimpleItemValues = getEnumValues(SimpleItemCode);
export const SpecialItemKeys = getEnumKeys(SpecialItemCode);
export const SpecialItemValues = getEnumValues(SpecialItemCode);

export const simpleItemConfig: Record<SimpleItemCode, ISimpleItemConfig> = {
    [SimpleItemCode.red]: {
        frame: 'red.png',
    },
    [SimpleItemCode.blue]: {
        frame: 'blue.png',
    },
    [SimpleItemCode.green]: {
        frame: 'green.png',
    },
    [SimpleItemCode.orange]: {
        frame: 'orange.png',
    },
    [SimpleItemCode.purple]: {
        frame: 'purple.png',
    },
};

export const specialItemConfig: Record<SpecialItemCode, ISpecialItemConfig> = {
    [SpecialItemCode.cross]: {
        frame: 'cross/special-cross.png',
    },
    [SpecialItemCode.radial]: {
        frame: 'blast/special-blast.png',
    },
};

gsap.registerPlugin(CustomEase);
CustomEase.create(
    'blast-single-bounce',
    'M0,0,C0.14,0,0.27,0.191,0.352,0.33,0.43,0.462,0.53,0.963,0.538,1,0.546,0.985,0.672,0.83,0.778,0.83,0.888,0.83,0.993,0.983,1,1',
);
