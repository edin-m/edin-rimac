import { GameNotFound } from "./exceptions";
import { Game, GameId, GameMove } from "./game";

export interface GameRepo {
    get(id: GameId): Promise<Game>;

    put(id: GameId, game: Game): Promise<void>;

    putMove(id: GameId, move: GameMove): Promise<void>;
}

export class GameRepoImpl implements GameRepo {
    private db: object = {};

    constructor() {
        // add logger
    }

    async get(id: GameId): Promise<Game> {
        if (!this.db[id]) {
            throw new GameNotFound(id);
        }
        return this.db[id];
    }

    async put(id: number, game: Game): Promise<void> {
        this.db[id] = game;
    }

    async putMove(id: GameId, move: GameMove): Promise<void> {
        const game = await this.get(id);
        game.moves.push(move);
        return this.put(id, game);
    }
}