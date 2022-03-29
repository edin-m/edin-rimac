import { GameId } from "./game";

export class GameNotFound extends Error {
    constructor(id: GameId) {
        super(`Game not found ${id}`);
    }
}