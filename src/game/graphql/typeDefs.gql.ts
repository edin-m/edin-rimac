import { gql } from "apollo-server-express";
import { gameTypes } from "../constants";

const GameMoveParams = `
    playerId: ID!
    row: Int!
    col: Int!
    val: GameVal
`;

const GameTypeParams = `
    ${gameTypes.sp}
    ${gameTypes.mp}
`;

export default gql`

    type Game {
        id: ID!
        gameType: String
        state: [String]
        player1: ID
        player2: ID
        moves: [GameMove]
    }

    enum GameType {
        ${GameTypeParams}
    }

    # _ => no play
    enum GameVal {
        X, O, _
    }

    input GameMoveInput {
        ${GameMoveParams}
    }

    type GameMove {
        ${GameMoveParams}
    }

    type GameEvent {
        move: GameMove,
        state: [String],
        message: String
    }

    type Player {
        playerId: ID!
    }

    type Query {
        game(id: ID!): Game
        games: [Game]
        history(gameId: ID!): [GameMove]
    }

    type Mutation {
        createNewGame(gameType: GameType): Game
        joinGame(gameId: ID!): Player
        makeMove(gameId: ID!, gameMove: GameMoveInput!): GameMove
    }

    type Subscription {
        gameEvent(gameId: ID!): GameEvent
    }

`;