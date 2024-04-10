import type { IBitmapFontOptions, ITextStyle, TextStyle } from 'pixi.js';
import { getResolution } from '../../../../utils';
import { fastFrom } from '../utils/bitmap-parse';
import type { ISubloader } from './subloader';

export class FontLoader implements ISubloader {
    private _bitmapFonts: Record<string, ITextStyle>;
    private _bitmapFontsKeys: string[];

    public constructor(bitmapFonts: Record<string, ITextStyle>) {
        this._bitmapFonts = bitmapFonts;
        this._bitmapFontsKeys = Object.keys(bitmapFonts);
    }

    public async load(cache: Record<string, unknown>, key: string, resource: string): Promise<void> {
        const result = await new FontFace(key, `url(${resource})`).load();
        cache[key] = document.fonts.add(result);

        this._loadBitmapFonts(key);
    }

    private _loadBitmapFonts(fontFamily: string): void {
        const fontNames = this._bitmapFontsKeys.filter((k) => this._bitmapFonts[k]['fontFamily'] === fontFamily);

        fontNames.forEach((name) => {
            /* style */
            const rawStyle: TextStyle | Partial<ITextStyle> = {
                fontSize: 60,
                fill: '#ffffff',
            };
            const style: Partial<ITextStyle> = Object.assign(rawStyle, this._bitmapFonts[name]);

            /* options */
            const rawOptions: IBitmapFontOptions = {
                textureHeight: 2048,
                textureWidth: 2048,
                padding: Number(style.fontSize) * 0.1,
                resolution: getResolution(),
            };

            const options: Partial<ITextStyle> = Object.assign(rawOptions, {});

            /* font */
            fastFrom(name, style, options);
        });
    }
}
