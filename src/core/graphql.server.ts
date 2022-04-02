import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { execute, subscribe } from "graphql";
import { createServer, Server } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

export async function createGraphQLServer(typeDefs: any, resolvers: any): Promise<[Server, ApolloServer]> {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    const subServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: '/graphql' }
    );

    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subServer.close();
                        }
                    }
                }
            }
        ]
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log('Server is now running on port ' + PORT);
    });

    return [httpServer, server];
}
