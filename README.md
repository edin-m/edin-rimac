# Tic Tac Toe

A quick sample project providing GraphQL API for the game of Tic Tac Toe written in TypeScript.

### Requirements

* Node.js
* tsc in `$PATH`
* Port `4000` is not used

### Setup & start

```
$ npm install
$ npm run build
$ npm run start
```

### Usage

Go to [http://localhost:4000/graphql](http://localhost:4000/graphql) and openg GraphQL console.

Check [src/game/graphql/typeDefs.gql.ts](src/game/graphql/typeDefs.gql.ts) for full specification

```GraphQL
# Get games
query getAllGames {
  game(id: "624639ac7444547de4839956") {
    id
  }
  games {
    id
  }
}

# Create a game (sp or mp - single/multi player)
mutation createGame {
  createNewGame(gameType: sp) {
    id,
    gameType,
    state
  }
}

response "id": "6246483c1f50cd355ce205aa",

# Join a game (once for single player, twice for multi player)
mutation joinGame {
  joinGame(gameId: "6246483c1f50cd355ce205aa") {
    playerId
  }
}

response "playerId": "624648511f50cd355ce205ad"

# Make a move
mutation makeMove($gameMove: GameMoveInput!) {
  makeMove(gameId: "6246483c1f50cd355ce205aa", gameMove: $gameMove) {
    playerId,
    row,
    col,
    val
  }
}

response game move

# subscribe
subscription subscribe {
  gameEvent(gameId: "6246483c1f50cd355ce205aa") {
    move {
      col,
      row,
      playerId,
      val
    },
    state,
    message
  }
}

# get history
query GetHistory {
  history(gameId: "6246483c1f50cd355ce205aa") {
    row,
    col,
    val,
    playerId
  }
}

```

### Test

```
$ npm test
```

### Configuration 

You can change database config in `src/config/config.ts`
Or you can pass in environment variables:

- DB_USER
- DB_PASS
- DB_HOST
- DB_NAME

### Future work
[ ] - Ability for computer to play the first move  
[ ] - Implement Game AI  
[ ] - N-sized game board  
[ ] - Improve test coverage  
[ ] - Improve Mongoose-related models static typing  
