import type { ISubloader } from './subloader';

export class JsonLoader implements ISubloader {
    public async load(cache: Record<string, unknown>, key: string, resource: string): Promise<void> {
        const response = await fetch(resource);
        const json = await response.json();
        cache[key] = json;
    }
}
