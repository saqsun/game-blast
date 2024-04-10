import { sounds } from '../../../assets/sounds';
import { SpecialItemCode } from '../../../game/blast/blast-constants';
import { mono } from '../../../mono';

interface IPlayOptions {
    loop?: boolean;
    volume?: number;
}

export class SoundPlugin implements IAppPlugin {
    private readonly _sounds: Record<string, Howl> = {};

    public constructor(private readonly _app: IApp) {
        //
    }

    public async onInstall(): Promise<void> {
        this._app.emitter.on('start', this._onAppStart, this);

        mono.view.once('Blast:CoreReady', this._onBlastCoreReady, this);
    }

    public async onUninstall(): Promise<void> {
        this._app.emitter.off('start', this._onAppStart, this);
    }

    private _onAppStart(): void {
        this._initSounds(Object.keys(sounds));

        this._createBurstSprite();
        this._createSFXSprite();
    }

    private _onBlastCoreReady(blast: IBlast): void {
        blast.emitter.on('Action:TapAccept', (action: IMoveAction, matches: IMatchResult[]) =>
            this._onMatchAccept(matches),
        );
    }

    private async _onMatchAccept(matches: IMatchResult[]): Promise<void> {
        for (const match of matches) {
            const { points, special } = match;
            if (special != null) {
                this._onItemExplode(special.code);
                await this._app.ticker.wait(200);
                continue;
            }
            this._playBurst(Math.min(points.length - 1, 10));
        }
    }

    private async _onItemExplode(code: ItemCode): Promise<void> {
        switch (code) {
            case SpecialItemCode.radial:
                this._playSFX('bombExplode');
                break;
            case SpecialItemCode.cross:
                this._playSFX('rocketExplode');
                break;
        }
    }

    private _play(alias: string, options?: IPlayOptions): Howl {
        const sound = this._sounds[alias];

        sound.loop(options?.loop ?? false);
        sound.volume(options?.volume ?? 1);
        sound.play();

        return sound;
    }

    private _playBurst(index: number, options?: IPlayOptions): void {
        const sound = this._sounds[sounds.burst];
        const id = sound.play(`burst${index}`);
        sound.volume(options?.volume ?? 1, id);
    }

    private _playSFX(sprite: string, options?: IPlayOptions): void {
        const sound = this._sounds[sounds.sfx];
        const id = sound.play(sprite);
        sound.volume(options?.volume ?? 1, id);
    }

    private _createBurstSprite(): void {
        const sound = this._sounds[sounds.burst];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _sprite }: { _sprit: Record<string, [number, number]> } = sound;
        _sprite.burst1 = [0, 4000];
        _sprite.burst2 = [5000, 4000];
        _sprite.burst3 = [10000, 4000];
        _sprite.burst4 = [15000, 4000];
        _sprite.burst5 = [20000, 4000];
        _sprite.burst6 = [25000, 4000];
        _sprite.burst7 = [30000, 4000];
        _sprite.burst8 = [35000, 4000];
        _sprite.burst9 = [40000, 4000];
        _sprite.burst10 = [45000, 4000];
    }

    private _createSFXSprite(): void {
        const sound = this._sounds[sounds.sfx];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _sprite }: { _sprit: Record<string, [number, number]> } = sound;
        _sprite.bombExplode = [0, 143.0385487528345];
        _sprite.rocketExplode = [2000, 2096.734693877551];
        _sprite.powerUpCreate = [6000, 2500];
    }

    private readonly _initSounds = (keys: string[]): void => {
        if (keys.length === 0) {
            return;
        }

        const howls = window.Howler._howls;
        keys.forEach((key: string) => {
            const found = howls.find((howl) => howl._id === key);
            if (found != null) {
                this._sounds[key] = found;
            }
        });
    };
}
