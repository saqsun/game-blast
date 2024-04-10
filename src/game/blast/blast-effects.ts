import type { EmitterConfigV1, EmitterConfigV2 } from '@pixi/particle-emitter';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import gsap, { Power1 } from 'gsap';
import type { ColorSource } from 'pixi.js';
import { Container, Sprite, Texture } from 'pixi.js';
import { particles } from '../../assets/particles';
import { textures } from '../../assets/textures';
import { angle2pos, randomInRange } from '../../utils';
import { SimpleItemCode, SpecialItemCode, cellDimension } from './blast-constants';
import { chunkPointsFromOrigin } from './blast-utils';

const simpleItemCodeToColor: Record<SimpleItemCode, ColorSource> = {
    [SimpleItemCode.red]: '#ce3147',
    [SimpleItemCode.blue]: '#2494e2',
    [SimpleItemCode.green]: '#73bb39',
    [SimpleItemCode.orange]: '#dd9e18',
    [SimpleItemCode.purple]: '#ac3e98',
};

class ExplodeParticle extends Sprite {
    public radius: number = 0;
    public angleVal: number = 0;
    public xVal: number = 0;
    public yVal: number = 0;
}

class ExplodeParticles {
    private static readonly _speedX = 3.5;
    private static readonly _speedY = 5;

    private readonly _particles: ExplodeParticle[] = [];
    private readonly _parent: Container;
    private readonly _center: IPoint;
    private readonly _radius: number;
    private readonly _lifetime: number;

    private _gravity: IPoint;
    private _force: IPoint;
    private _angleInc: number;

    private _gravityValue: IPoint = { x: 0, y: 0 };

    public constructor(config: {
        tint: ColorSource;
        center: IPoint;
        count: number;
        parent: Container;
        radius: number;
        scale: number;
        force: IPoint;
        gravity: IPoint;
        lifetime: number;
    }) {
        const { tint, center, count, parent, radius, scale, force, gravity, lifetime } = config;

        this._parent = parent;
        this._center = center;
        this._radius = radius;
        this._lifetime = lifetime;
        this._angleInc = 360 / count;
        this._gravity = gravity;
        this._force = force;

        let angle = 0;
        let pos: IPoint;

        for (let i = 0; i < count; i++) {
            const particle = new ExplodeParticle(
                Texture.from(textures[`blast/effects/particle-frag${randomInRange(0, 5, 0)}` as keyof typeof textures]),
            );

            particle.anchor.set(0.5);
            particle.scale.set(randomInRange(0.3, 1, 1) * scale);
            particle.tint = tint;
            particle.angle = Math.random() * 360;
            particle.angleVal = randomInRange(-10, 10, 1);

            angle += this._angleInc;
            pos = angle2pos({ x: 0, y: 0 }, this._radius * Math.random(), angle);

            particle.xVal = pos.x * 1.3;
            particle.yVal = pos.y;
            particle.x = pos.x + this._center.x;
            particle.y = pos.y + this._center.y;

            this._particles.push(particle);
        }
    }

    public emit(): void {
        const { app } = gameblast;

        //
        const explodeTimeline = gsap.timeline({
            onStart: () => {
                this._particles.forEach((p) => this._parent.addChild(p));
                app.ticker.add(this.update);
            },
            onComplete: () => {
                this._particles.forEach((p) => {
                    this._parent.removeChild(p);
                    p.destroy();
                });
                this._particles.length = 0;
                app.ticker.remove(this.update);
            },
        });
        //
        explodeTimeline.add([
            gsap.to(this._particles, {
                pixi: { scale: 0 },
                delay: () => randomInRange(0.1, 0.5, 2),
                duration: () => this._lifetime + randomInRange(-0.1, 0.1, 2),
            }),
        ]);
        //
    }

    public update = (time: number, delta: number): void => {
        const d = delta / (1000 / 60);
        for (let i = 0; i < this._particles.length; i++) {
            this._gravityValue.x += this._gravity.x * d;
            this._gravityValue.y += this._gravity.y * d;

            const element = this._particles[i];

            element.xVal *= this._force.x;
            element.yVal *= this._force.y;
            element.xVal += this._gravityValue.x;
            element.yVal += this._gravityValue.y;
            element.x = element.xVal * (ExplodeParticles._speedX * d) + this._center.x;
            element.y = element.yVal * (ExplodeParticles._speedY * d) + this._center.y;
            element.angle += element.angleVal * d;
        }
    };
}

class RocketSet {
    private static readonly _set = [
        {
            texture: textures['blast/effects/rocket-blue-image'],
            anchor: { x: 0.5, y: 1.15 },
            scale: { x: 1, y: 1 },
        },
        {
            texture: textures['blast/effects/rocket-blue-image'],
            anchor: { x: 0.5, y: 1.15 },
            scale: { x: 1, y: -1 },
        },
        {
            texture: textures['blast/effects/rocket-purple-image'],
            anchor: { x: -0.15, y: 0.5 },
            scale: { x: 1, y: 1 },
        },
        {
            texture: textures['blast/effects/rocket-purple-image'],
            anchor: { x: -0.15, y: 0.5 },
            scale: { x: -1, y: 1 },
        },
    ];

    private readonly _parent: Container;
    private readonly _rockets: Sprite[];

    public constructor(config: { parent: Container; center: IPoint }) {
        const { parent, center } = config;
        this._parent = parent;
        this._rockets = RocketSet._set.map((s) => this._addRocket(center, s));
    }

    public async ignite(width: number, height: number): Promise<void> {
        const dX = cellDimension.width * width;
        const dY = cellDimension.height * height;
        const duration = 0.07 * Math.max(width, height);
        gsap.to(this._rockets, {
            y: (index: number, target: Sprite, targets: any[]) => {
                const { anchor, scale } = target;
                if (anchor.x === 0.5) {
                    return `-=${dY * scale.y}`;
                }
                return `+=${0}`;
            },
            x: (index: number, target: Sprite, targets: any[]) => {
                const { anchor, scale } = target;
                if (anchor.y === 0.5) {
                    return `+=${dX * scale.x}`;
                }
                return `+=${0}`;
            },
            duration,
            ease: Power1.easeIn,
            onComplete: () => {
                this._rockets.forEach((r) => {
                    this._parent.removeChild(r);
                    r.destroy();
                });
                this._rockets.length = 0;
            },
        });
    }

    private _addRocket(center: IPoint, config: { texture: string; anchor: IPoint; scale: IPoint }): Sprite {
        const { texture, anchor, scale } = config;
        const r = Sprite.from(texture);
        r.position.copyFrom(center);
        r.anchor.copyFrom(anchor);
        r.scale.copyFrom(scale);
        this._parent.addChild(r);
        return r;
    }
}

export class BlastEffects extends Container {
    private _app: IApp;
    public constructor(private _blast: IBlast) {
        super();

        const { app } = gameblast;
        this._app = app;

        this._blast.addChild(this);
    }

    public async processMatches(matches: IMatchResult[]): Promise<void> {
        for await (const match of matches) {
            const { points, special } = match;
            if (special) {
                await this._processSpecial(points, special);
            } else {
                await this._processSimple(points);
            }
        }
        await this._app.ticker.wait(120);
    }

    private async _processSpecial(points: IGridPoint[], special: IMatchResult['special']): Promise<void> {
        const { center, code } = special!;
        switch (code) {
            case SpecialItemCode.radial:
                await this._processRadial(points, center);
                break;
            case SpecialItemCode.cross:
                await this._processCross(points, center);
                break;
        }
    }

    private async _processSimple(points: IGridPoint[]): Promise<void> {
        for await (const p of points) {
            const { row, col } = p;
            this._processSimpleCell(this._blast.board.getCell(row, col)!);
        }
    }

    private async _processSimpleCell(cell: IBlastCell): Promise<void> {
        cell.animateExplode();
        const { item } = cell;
        const { code } = item;
        const lp = this.toLocal(cell, cell.parent);
        const ex = new ExplodeParticles({
            tint: simpleItemCodeToColor[code as SimpleItemCode],
            center: lp,
            count: 15,
            parent: this,
            radius: 7,
            scale: 3,
            force: { x: 1.038, y: 1.05 },
            gravity: { x: 0, y: 0.00006 },
            lifetime: 0.2,
        });
        ex.emit();
    }

    private async _processRadial(points: IGridPoint[], origin: IGridPoint): Promise<void> {
        const { row, col } = origin;
        const simplePoints = points.filter((p) => p.row !== row || p.col !== col);
        await this._processBombCell(this._blast.board.getCell(origin.row, origin.col)!);
        for await (const p of simplePoints) {
            const { row, col } = p;
            this._processSimpleCell(this._blast.board.getCell(row, col)!);
        }
    }

    private async _processBombCell(cell: IBlastCell): Promise<void> {
        await cell.animateExplode();
        return new Promise((resolve) => {
            (async () => {
                const lp = this.toLocal(cell.item.view, cell.item.view.parent);
                const ex = new ExplodeParticles({
                    tint: '#42394d',
                    center: lp,
                    count: 60,
                    parent: this,
                    radius: 18,
                    scale: 6,
                    force: { x: 1.038, y: 1.05 },
                    gravity: { x: 0, y: 0.00006 },
                    lifetime: 0.5,
                });
                ex.emit();
                await this._app.ticker.wait(90);
                resolve();
            })();
        });
    }

    private async _processCross(points: IGridPoint[], origin: IGridPoint): Promise<void> {
        const { row, col } = origin;
        const simplePoints = points.filter((p) => p.row !== row || p.col !== col);
        await this._processCrossCell(this._blast.board.getCell(origin.row, origin.col)!);
        await this._processChunk(chunkPointsFromOrigin(simplePoints, origin));
    }

    private async _processCrossCell(cell: IBlastCell): Promise<void> {
        const { loader } = this._app;
        const { cache } = loader;
        await cell.animateExplode();
        const lp = this.toLocal(cell.item.view, cell.item.view.parent);
        const rs = new RocketSet({ parent: this, center: lp });
        const { grid } = this._blast.board;
        rs.ignite(grid[0].length, grid.length);

        const config = upgradeConfig(cache.particles[particles['rocket-ignite']] as EmitterConfigV2 | EmitterConfigV1, [
            textures['blast/effects/particle-frag0'],
            textures['blast/effects/particle-frag1'],
            textures['blast/effects/particle-frag2'],
            textures['blast/effects/particle-frag3'],
            textures['blast/effects/particle-frag4'],
            textures['blast/effects/particle-frag5'],
        ]);
        const emitter = new Emitter(this, config);
        emitter.spawnPos.copyFrom(lp);
        emitter.playOnceAndDestroy();
    }

    private async _processChunk(chunks: IGridPoint[][]): Promise<void> {
        for await (const chunk of chunks) {
            await Promise.all(chunk.map((p) => this._processSimpleCell(this._blast.board.getCell(p.row, p.col)!)));
            await this._app.ticker.wait(80);
        }
    }
}
