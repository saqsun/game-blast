import { RawItemCode, SimpleItemCode, SpecialItemCode } from '../blast-constants';
import { BlastItemNone } from './blast-item-none';
import { BlastItemSimple } from './blast-item-simple';
import { BlastItemSpecial } from './blast-item-special';

type ConstructorType<T> = new (...args: any[]) => T;

export class BlastItemFactory {
    public static dispose(): void {
        pool.dispose();
    }

    public static giveBack(item: IBlastItem): void {
        pool.giveBack(item);
    }

    public static get(itemCode: ItemCode): IBlastItem {
        switch (itemCode) {
            case RawItemCode.empty:
                return pool.get(BlastItemNone);

            case SimpleItemCode.red:
            case SimpleItemCode.blue:
            case SimpleItemCode.green:
            case SimpleItemCode.orange:
            case SimpleItemCode.purple:
                return pool.get(BlastItemSimple);

            case SpecialItemCode.cross:
            case SpecialItemCode.radial:
                return pool.get(BlastItemSpecial);

            default:
                throw new Error(`Unknown item code ${itemCode}`);
        }
    }
}

class SinglePool<P extends IPoolInstance> {
    private readonly _pool: Array<P> = [];
    private readonly _ctor: ConstructorType<P>;

    public constructor(ctor: ConstructorType<P>) {
        this._pool = [];
        this._ctor = ctor;
    }

    public get(): P {
        return this._pool.pop() ?? new this._ctor().onCreate();
    }

    public giveBack(item: P): void {
        if (this._pool.includes(item)) {
            return;
        }

        this._pool.push(item);
    }

    public dispose(): void {
        this._pool.length = 0;
    }
}

class MultiPool {
    private readonly _map: Map<ConstructorType<any>, SinglePool<any>> = new Map();

    public get<T extends ConstructorType<IPoolInstance>>(ctor: T): InstanceType<T> {
        let pool = this._map.get(ctor);

        if (pool == null) {
            pool = new SinglePool(ctor);
            this._map.set(ctor, pool);
        }

        return pool.get();
    }

    public giveBack(item: InstanceType<any>): void {
        const pool = this._map.get(item.constructor);

        if (pool) {
            pool.giveBack(item);
        }
    }

    public dispose(): void {
        this._map.forEach((pool) => pool.dispose());
        this._map.clear();
    }
}

const pool = new MultiPool();
