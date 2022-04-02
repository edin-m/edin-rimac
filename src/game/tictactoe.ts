import { GAME_BOARD_SIZE } from "./constants";
import { PlayerId } from "./types";

export enum GameResult {
    Unfinished,
    Draw,
    XWon,
    OWon
}

export class TicTacToe {
    private boardSize = 3;

    private state: [string, string, string];

    // generate for board of size N | N > 3
    private combinations = [
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],

        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
    ];

    constructor(state: [string, string, string], boardSize = GAME_BOARD_SIZE) {
        this.state = state;
        this.boardSize = boardSize;

        if (this.boardSize > 3) {
            throw new Error('Board sizes > 3 not supported');
        }
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

        let index = this.randomIntFromInterval(0, empty.length - 1);
        return empty[index];
    }

    private randomIntFromInterval(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}