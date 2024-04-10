import { mono } from '../../../mono';

export class UIModel {
    public constructor() {
        //
    }

    public initialize(): void {
        mono.model.emit('UI:Initialized', this);
    }
}
