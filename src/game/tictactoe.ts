import { GAME_BOARD_SIZE } from "./constants";
import { PlayerId } from "./types";

export enum GameResult {
    Unfinished,
    Draw,
    XWon,
    OWon
}

export class TicTacToe {
    private boardSize: number;

    private state: Array<string>;

    // generate for board of size N | N > 3
    combinations: [number, number][][] = [];

    constructor(state: Array<string>, boardSize = GAME_BOARD_SIZE) {
        this.state = state;
        this.boardSize = boardSize;

        this._generateCombinations();
    }

    private _generateCombinations() {
        const combos: [number, number][][] = [];
        const n = this.boardSize;

        // rows,cols
        for (let i = 0; i < n; i++) {
            const arrRow: [number, number][] = [];
            const arrCol: [number, number][] = [];
            for (let j = 0; j < n; j++) {
                arrRow.push([i, j]);
                arrCol.push([j, i]);
            }
            combos.push(arrRow);
            combos.push(arrCol);
        }

        // diags
        const diagLR: [number, number][] = [];
        const diagRL: [number, number][] = [];
        for (let i = 0; i < n; i++) {
            diagLR.push([i, i]);
            diagRL.push([i, n-1-i]);
        }
        combos.push(diagLR);
        combos.push(diagRL);

        this.combinations = combos;
    }

    setState(state: any) {
        this.state = state;
    }

    getGameResult(): GameResult {
        let atLeastOne_ = false;

        for (let i = 0; i < this.combinations.length; i++) {
            let matches = true;
            const combination = this.combinations[i];
            let ex = this.state[combination[0][0]][combination[0][1]];
            inner: for (let pair of this.combinations[i]) {
                const [row, col] = pair;
                const val = this.state[row][col];
                if (val === '_') {
                    atLeastOne_ = true;
                }
                if (ex != val) {
                    matches = false;
                    break inner;
                }
            }
            if (matches) {
                if (ex === 'X') return GameResult.XWon;
                if (ex === 'O') return GameResult.OWon;
            }
        }

        if (atLeastOne_) {
            return GameResult.Unfinished;
        }

        return GameResult.Draw;
    }

    getNextPlayerLetter(game: any): [PlayerId, string] {
        const numOfMoves = game.moves.length;
        let shouldBePlayer = game.player2.toHexString();
        let letter = 'O';
        if (numOfMoves % 2 === 0) {
            shouldBePlayer = game.player1.toHexString();
            letter = 'X';
        }
        return [shouldBePlayer, letter];
    }

    aiNextMove(state: [string], ai = 'O', foe = 'X') {
        const empty: [number, number][] = [];

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (state[i][j] === '_') {
                    empty.push([i+1, j+1]);
                }
            }
        }

        let index = this._randomIntFromInterval(0, empty.length - 1);
        return empty[index];
    }

    private _randomIntFromInterval(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}