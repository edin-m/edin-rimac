import { PubSub } from "graphql-subscriptions";
import { App, Module } from "../../core/interfaces";
import { IoC } from "../../core/ioc";
import { services } from "./constants";
import { GameService, GameServiceImpl } from "./service";

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs.gql';
import Game from "./schema/game";

export class GameModule implements Module {

    private gameService: GameService;
 
    constructor(ioc: IoC) {
        this.gameService = new GameServiceImpl(ioc);
    }

    register(app: App): void {
        const pubsub = app.ioc.resolve<PubSub>(IoC.GlobalServices.pubsub);

        // register graphql stuff
        app.installResolvers(resolvers(this.gameService, pubsub));
        app.installTypeDefs(typeDefs);

        // export services here
        app.ioc.register(`game.${services.GAME_MODEL}`, Game);
        app.ioc.register(`game.${services.GAME_SERVICE}`, this.gameService);
    } 
    
}

