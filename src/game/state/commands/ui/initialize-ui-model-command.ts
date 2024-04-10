import type { MonoType } from '../../../../mono/types';
import { UIModel } from '../../models/ui-model';

export const initializeUIModelCommand = (store: MonoType.IStore): void => {
    store.setUI(new UIModel());
};
