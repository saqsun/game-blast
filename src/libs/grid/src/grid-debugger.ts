import { Graphics } from 'pixi.js';
import type { ICellDebugConfig, IGrid } from './types';

export class GridDebugger extends Graphics {
    public draw(grid: IGrid, config?: ICellDebugConfig): void {
        this.clear();

        if (config == null) {
            return;
        }

        const { color = 0xffffff, fill = 0 } = config;

        const { x: gax, y: gay, width: gaw, height: gah } = grid.area;

        this.lineStyle({ width: 2, color, alpha: 1, alignment: 0 });
        this.drawRect(gax, gay, gaw, gah);

        this.beginFill(color, fill);
        grid.cells.forEach((cell) => {
            console.log(cell);
            const { x: cbx, y: cby, width: cbw, height: cbh } = cell.bounds;
            const { x: cax, y: cay, width: caw, height: cah } = cell.area;

            this.lineStyle({ width: 2, color, alpha: 1, alignment: 0 });
            this.drawRect(cbx, cby, cbw, cbh);

            this.lineStyle({ width: 2, color, alpha: 1, alignment: 0 });
            this.drawRect(cax, cay, caw, cah);
        });
        this.endFill();
    }
}
