import { RawItemCode } from './blast-constants';
import { BlastEmitterLogger } from './blast-emitter';

const boardStyle = 'color: #40e3cd; font-size:12px';

export class BlastDebug {
    public constructor(
        private readonly _blast: IBlast,
        speed: number,
    ) {
        new BlastEmitterLogger(this._blast.emitter);

        this._blast.emitter.on('Core:Ready', this._onReady, this);
        this._blast.emitter.on('Action:TapAccept', this._onTapAccept, this);
        this._blast.emitter.on('Action:TapReject', this._onTapReject, this);
        this._blast.emitter.on('Process:RoundComplete', this._onRoundComplete, this);
    }

    private static _getDivider(length: number, symbol: string, prefix: string): string {
        let divider = prefix;
        for (let i = 0; i < length; i++) {
            divider += symbol;
        }

        return divider;
    }

    public logGrid(grid: IBlastGrid, logEmpty = false): void {
        const rows = grid.length;
        const cols = grid[0].length;

        const divider = BlastDebug._getDivider(cols * 4, '-', '');

        let str = `${divider}\n`;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const code = grid[row][col];
                const codeStr =
                    !logEmpty && code === RawItemCode.empty ? '    ' : code < 10 ? `|0${code}|` : `|${code}|`;
                str += codeStr;
            }

            str += '\n';
        }

        str += `${divider}`;

        console.info(`%c${str}`, boardStyle);
    }

    private _onReady(): void {
        this.logGrid(this._blast.board.grid);
    }

    private _onTapAccept(): void {
        this.logGrid(this._blast.board.grid);
    }

    private _onTapReject(): void {
        this.logGrid(this._blast.board.grid);
    }

    private _onRoundComplete(): void {
        this.logGrid(this._blast.board.grid);
    }
}
