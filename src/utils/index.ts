export const MAX_RESOLUTION = 2;

export const getDocumentPrefix = (document: Document): string => {
    return document.mozHidden != null
        ? 'moz'
        : document.webkitHidden != null
          ? 'webkit'
          : document.msHidden != null
            ? 'ms'
            : '';
};

export const lowercaseFirst = (str: string): string => {
    return str.substring(0, 1).toLowerCase() + str.substring(1);
};

export const getGameDiv = (): HTMLDivElement => {
    return document.getElementById('game_div') as HTMLDivElement;
};

export const getGameCanvas = (): HTMLCanvasElement => {
    return document.getElementById('game_canvas') as HTMLCanvasElement;
};

export const getResolution = (): number => {
    return Math.min(window.devicePixelRatio ?? 1, MAX_RESOLUTION) << 0;
};

export const getEnumKeys = <T extends object>(anEnum: T): (keyof T)[] => {
    const keys = Object.keys(anEnum);

    return keys.slice(keys.length / 2) as (keyof T)[];
};

export const getEnumValues = <T extends object>(anEnum: T): T[keyof T][] => {
    const keys = Object.values(anEnum);

    return keys.slice(keys.length / 2) as T[keyof T][];
};

export const lp = <L, P>(l: L, p: P): L | P => {
    if (window.matchMedia('(orientation: portrait)').matches) {
        return p;
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
        return l;
    }
    return p;
};

export const randomInRange = (min: number, max: number, decimals: number): number => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
};

export const angle2pos = (center: IPoint, radius: number, rotation: number): IPoint => {
    return { x: center.x + radius * Math.cos(rotation), y: center.y + radius * Math.sin(rotation) };
};
