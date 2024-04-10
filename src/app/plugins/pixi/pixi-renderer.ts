import { Renderer } from 'pixi.js';
import { getGameCanvas, getResolution } from '../../../utils';

export class PixiRenderer extends Renderer {
    public constructor() {
        super({
            hello: true,
            view: getGameCanvas(),
            resolution: getResolution(),
            backgroundAlpha: 1,
            backgroundColor: 0xa1a1a1,
        });
    }
}
