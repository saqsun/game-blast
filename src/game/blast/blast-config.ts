import { getBlastConfig } from './blast-constants';

export class BlastConfig {
    private readonly _config: IBlastConfig;

    public constructor() {
        this._config = getBlastConfig();
    }

    public get board(): IBlastConfig['board'] {
        return this._config.board;
    }

    public get actions(): IBlastConfig['actions'] {
        return this._config.actions;
    }

    public get process(): IBlastConfig['process'] {
        return this._config.process;
    }

    public get matcher(): IBlastConfig['matcher'] {
        return this._config.matcher;
    }

    public get stats(): IBlastConfig['stats'] {
        return this._config.stats;
    }

    public get hint(): IBlastConfig['hint'] {
        return this._config.hint;
    }
}
