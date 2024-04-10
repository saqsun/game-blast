import type { ISpritesheetData, Texture } from 'pixi.js';
import { Assets, Spritesheet } from 'pixi.js';
import type { ISubloader } from './subloader';

export class AtlasLoader implements ISubloader {
    public async load(
        cache: Record<string, unknown>,
        key: string,
        resource: { image: string; json: string },
    ): Promise<void> {
        const { image, json } = resource;
        const [texture, data] = await Promise.all([this._loadTexture(image), this._loadData(json)]);

        const atlas = await this._processAtlas(texture, data);

        cache[key] = atlas;
    }

    private async _loadTexture(urls: string): Promise<Texture> {
        return Assets.load(urls);
    }

    private async _loadData(urls: string): Promise<ISpritesheetData> {
        const response = await fetch(urls);
        return response.json();
    }

    private async _processAtlas(texture: Texture, data: ISpritesheetData): Promise<Spritesheet> {
        const atlas = new Spritesheet(texture.baseTexture, data);
        await atlas.parse();

        return atlas;
    }
}
