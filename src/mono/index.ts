import { Mono } from '../libs/mono';
import { StoreModel } from './store';
import type { MonoType } from './types';

export const mono = new Mono<MonoType.IEvents, MonoType.IStore>(new StoreModel());
