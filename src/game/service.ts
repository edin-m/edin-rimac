import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
import { CannotJoinGameFullError } from "./errors";
import Game from "./schema/game";
import { GameId, GameMove, GameType, PlayerId } from "./types";
import { IoC } from "../core/ioc";
import { events, gameTypes } from './constants';
import { GameResult, TicTacToe } from "./tictactoe";
import { GameValidator } from "./validator";

export interface GameService {
    getAllGames(): Promise<Array<typeof Game>>;
    getGameById(gameId: GameId): Promise<typeof Game | null>;
    getHistory(gameId: GameId): Promise<Array<GameMove>>;
    createNewGame(gameType: GameType): Promise<typeof Game>;
    joinGame(gameId: GameId): Promise<string | null>;
    makeMove(gameId: GameId, gameMove: GameMove): Promise<GameMove | null>;
}

export class GameServiceImpl implements GameService {

    private pubsub: PubSub;
    private validator = new GameValidator();

    constructor(ioc: IoC) {
        // inject needed dependencies from ioc here
        this.pubsub = ioc.resolve<PubSub>(IoC.GlobalServices.pubsub);
    }

    async getAllGames(): Promise<Array<typeof Game>> {
        console.debug(`getAllGames()`);
        return Game.find();
    }

    async getGameById(gameId: GameId): Promise<typeof Game> {
        console.debug(`getGameById(${gameId})`);
        const game = await Game.findById(gameId);
        this.validator.validateGameExists(gameId, game);
        return game;
    }

    async getHistory(gameId: GameId): Promise<Array<GameMove>> {
        console.debug(`getHistory(${gameId})`);
        const game = await Game.findById(gameId);
        this.validator.validateGameExists(gameId, game);
        return game.moves;
    }

    async createNewGame(gameType: string): Promise<typeof Game> {
        console.debug(`createNewGame(${gameType})`);
        const game = new Game();
        game.gameType = gameType;
        game.state = [
            '___',
            '___',
            '___',
        ];
        console.info('Saving new game ' + game.id);
        await game.save();
        return game;
    }

    async joinGame(gameId: GameId): Promise<string | null> {
        console.debug(`joinGame(${gameId})`);
        const game = await Game.findById(gameId);
        this.validator.validateGameExists(gameId, game);

        const playerId = new mongoose.Types.ObjectId();
        this.joinPlayer(game, playerId);

        console.info(`Saving gameId(${game.id})`);
        await game.save();
        return playerId.toHexString();
    }

    private joinPlayer(game: any, playerId: mongoose.Types.ObjectId) {
        if (!game.player1) {
            game.player1 = playerId;

            // join computer
            if (game.gameType === gameTypes.sp) {
                console.info(`Adding AI player to sp game ${game.id}`);
                game.player2 = new mongoose.Types.ObjectId();
            }
        }
        // join player2
        else if (!game.player2) {
            this.validator.checkGameSinglePlayer(game);
            game.player2 = playerId;
        }
        else {
            throw new CannotJoinGameFullError();
        }
    }

    async makeMove(gameId: GameId, gameMove: GameMove): Promise<GameMove | null> {
        console.debug(`gameId(${gameId})`);
        const game = await Game.findById(gameId);

        console.debug('Game validation');
        this.validator.validateGameExists(gameId, game);
        this.validator.validateBothPlayersJoined(game);

        console.debug('Game result validation');
        const ticTacToe = new TicTacToe(game.state);
        this.validator.validateTicTacToeFinished(ticTacToe);

        console.debug('Game move validation');
        this.validator.validateGameMove(gameMove);
        const [shouldBePlayer, letter] = ticTacToe.getNextPlayerLetter(game);
        
        console.debug('Game move player');
        this.validator.validateGameMovePlayer(game, gameMove, shouldBePlayer);

        console.debug('Update game');
        this.updateGame(game, gameMove, ticTacToe, letter);

        if (game.gameType === gameTypes.sp && ticTacToe.getGameResult() === GameResult.Unfinished) {
            const [row, col] = ticTacToe.aiNextMove(game.state);
            const aiGameMove: GameMove = {
                playerId: game.player2.toHexString(),
                gameId,
                row,
                col,
                val: 'O'
            };

            console.debug('Update game with AI ' + row + ' ' + col);
            this.updateGame(game, aiGameMove, ticTacToe, 'O');
        }

        console.info(`Saving gameId(${game.id})`);
        await game.save();
        return gameMove;
    }

    private updateGame(game: any, gameMove: GameMove, ticTacToe: TicTacToe, letter: string) {
        this.modifyGameState(game, gameMove, letter);
        ticTacToe.setState(game.state);

        const gameResult = ticTacToe.getGameResult();
        this.publishGameEvents(game, gameMove, gameResult);
    }

    private modifyGameState(game: any, gameMove: GameMove, letter: string) {
        if (gameMove.val === '_') {
            letter = '_';
        }
        const row = game.state[gameMove.row - 1].split('');
        row[gameMove.col - 1] = letter;
        game.state[gameMove.row - 1] = row.join('');
        gameMove.val = letter;

        game.moves.push(gameMove);
    }

    private publishGameEvents(game: any, gameMove: GameMove, gameResult: GameResult) {
        this.pubsub.publish(events.GAME_EVENT, {
            gameId: game.id,
            gameEvent: {
                move: gameMove,
                state: game.state
            }
        });

        if (gameResult !== GameResult.Unfinished) {
            this.pubsub.publish(events.GAME_EVENT, {
                gameId: game.id,
                gameEvent: {
                    state: game.state,
                    message: this.getGameEndMessage(gameResult)
                }
            });
        }
    }

    private getGameEndMessage(result: GameResult): string {
        let msg = 'Game finished - ';
        if (result === GameResult.Draw) {
            msg += 'Draw';
        }
        else if (result === GameResult.XWon) {
            msg += 'X Won';
        }
        else {
            msg += 'O Won';
        }
        return msg;
    }
}