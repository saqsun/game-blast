import { Layer, Stage } from '@pixi/layers';

export class PixiStage extends Stage {
    public readonly gameLayer = new Layer();
    public readonly uiLayer = new Layer();
    public readonly popupLayer = new Layer();

    public constructor() {
        super();

        this.addChild(this.gameLayer);
        this.addChild(this.uiLayer);
        this.addChild(this.popupLayer);
    }
}
