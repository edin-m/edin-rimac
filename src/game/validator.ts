import { NotFoundError } from "../errors";
import { gameTypes, GAME_BOARD_SIZE } from "./constants";
import { BothPlayersNotJoined as NotBothPlayersJoined, CannotJoinSinglePlayerGameError, InvalidGameMove, PlayerMissingError } from "./errors";
import { GameResult, TicTacToe } from "./tictactoe";
import { GameMove } from "./types";

export class GameValidator {

    constructor() { }

    validateGameExists(gameId: string, game: any) {
        if (!game) {
            throw new NotFoundError('Game', gameId);
        }
    }

    checkGameSinglePlayer(game: any) {
        if (game.gameType === gameTypes.sp) {
            throw new CannotJoinSinglePlayerGameError();
        }
    }

    validateTicTacToeFinished(ticTacToe: TicTacToe) {
        if (ticTacToe.getGameResult() !== GameResult.Unfinished) {
            throw new InvalidGameMove(`Game already finished.`);
        }
    }

    validateBothPlayersJoined(game: any) {
        if (!game.player1 || !game.player2) {
            throw new NotBothPlayersJoined();
        }
    }

    validateGameMove(gameMove: GameMove) {
        if (gameMove.row < 1 || gameMove.row > GAME_BOARD_SIZE) {
            throw new InvalidGameMove('Invalid row');
        }
        if (gameMove.col < 1 || gameMove.col > GAME_BOARD_SIZE) {
            throw new InvalidGameMove('Invalid col');
        }
        if (!/[XO_]/.test(gameMove.val)) {
            throw new InvalidGameMove('val must be one of (X, O, _)');
        }
    }

    validateGameMovePlayer(game: any, gameMove: GameMove, shouldBePlayer: string) {
        const players = [game.player1, game.player2].filter(x => !!x).map(x => x.toHexString());
        if (players.length !== 2 && game.gameType === gameTypes.mp) {
            throw new PlayerMissingError();
        }
        if (players.indexOf(gameMove.playerId) === -1) {
            throw new InvalidGameMove(`Player ${gameMove.playerId} did not join`);
        }
        if (shouldBePlayer !== gameMove.playerId) {
            throw new InvalidGameMove(`Player ${gameMove.playerId} should not play. Player ${shouldBePlayer} should.`);
        }
        if (game.state[gameMove.row - 1][gameMove.col - 1] !== '_') {
            throw new InvalidGameMove(`Location row=${gameMove.row} col=${gameMove.col} is occupied`);
        }
    }
}