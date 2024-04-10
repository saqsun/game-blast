import { Howl } from 'howler';
import type { ISubloader } from './subloader';

export class SoundLoader implements ISubloader {
    public async load(cache: Record<string, unknown>, key: string, resource: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const howl = new Howl({
                src: resource,
                autoplay: false,
                onload: (id: number) => {
                    Object.defineProperty(howl, '_id', {
                        value: key,
                    });
                    cache[key] = howl;
                    resolve();
                },
            });
        });
    }
}
