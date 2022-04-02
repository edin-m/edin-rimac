import { PubSub, withFilter } from "graphql-subscriptions";
import { GameService } from "../service";
import { events } from "../constants";
import { GameMove } from "../types";
import Game from '../schema/game';

export default function (gameService: GameService, pubsub: PubSub) {
    return {
        Query: {
            games: async () => {
                return gameService.getAllGames();
            },
            game: async (_, arg: { id: string }) => {
                return gameService.getGameById(arg.id);
            },
            history: async (_, arg: { gameId: string }) => {
                return gameService.getHistory(arg.gameId);
            }
        },
        Mutation: {
            async createNewGame(_, arg: { gameType: string }): Promise<typeof Game> {
                return gameService.createNewGame(arg.gameType);
            },
            async joinGame(_, arg: { gameId: string }) {
                const playerId = await gameService.joinGame(arg.gameId);
                return { playerId }
            },
            async makeMove(_, arg: { gameId: string, gameMove: GameMove }) {
                return await gameService.makeMove(arg.gameId, arg.gameMove);
            }
        },
        Subscription: {
            gameEvent: {
                subscribe: withFilter(
                        (_, __, ___) => pubsub.asyncIterator(events.GAME_EVENT),
                        (payload, variables) => {
                            return payload.gameId === variables.gameId;
                        }
                )
            }
        }
    }
}