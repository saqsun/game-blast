import { MonoCommand } from './command';
import { MonoModel } from './model';
import type { Events } from './types';
import { MonoView } from './view';

export class Mono<IEvents extends { view: Events; model: Events }, IStore extends Record<string, any>> {
    public readonly command: MonoCommand<IStore, IEvents['model'] & IEvents['view']>;
    public readonly model: MonoModel<IEvents['model']>;
    public readonly view: MonoView<IEvents['view']>;
    public readonly store: IStore;

    public constructor(store: IStore) {
        this.store = store;
        this.command = new MonoCommand(this.store);
        this.model = new MonoModel(this.command);
        this.view = new MonoView(this.command);
    }

    public removeListenersOf(context: any): void {
        this.view.removeListenersOf(context);
        this.model.removeListenersOf(context);
    }
}
