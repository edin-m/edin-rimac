import { ForbiddenError, UserInputError } from "apollo-server-core";

export class CannotJoinSinglePlayerGameError extends ForbiddenError {
    constructor() {
        super('Cannot join single player game');
    }
}

export class CannotJoinGameFullError extends ForbiddenError {
    constructor() {
        super('Game already joined by two players');
    }
}

export class PlayerMissingError extends ForbiddenError {
    constructor() {
        super('Not both players have joined the game');
    }
}

export class InvalidGameMove extends UserInputError {
    constructor(msg: string = '') {
        super('Invalid game move -- ' + msg);
    }
}

export class InavlidPlayerGameMove extends UserInputError {
    constructor() {
        super('Invalid playerId in GameMove - player hasn\'t joined the game');
    }
}

export class BothPlayersNotJoined extends ForbiddenError {
    constructor() {
        super('Not both players have joined');
    }
}
