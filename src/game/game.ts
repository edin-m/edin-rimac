import { Optional } from "../types";

export type GameId = number;

export type GameType = 'sp' | 'mp';

export type Row = 1|2|3;
export type Column = 1|2|3;

export class GameMove {
    position: { row: Row, column: Column };
}

export class Game {
    gameType: GameType = 'sp';

    startedAt: Date;

    finishedAt: Optional<Date>;

    moves: Array<GameMove> = [];

    constructor(startedAt: Date) {
        
    }
}