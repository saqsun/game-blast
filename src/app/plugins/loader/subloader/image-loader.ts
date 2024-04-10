import type { Texture } from 'pixi.js';
import { Assets } from 'pixi.js';
import type { ISubloader } from './subloader';

export class ImageLoader implements ISubloader {
    public async load(cache: Record<string, unknown>, key: string, resource: string): Promise<void> {
        const image: Texture = await Assets.load({
            alias: key,
            src: resource,
        });
        cache[key] = image;
    }
}
